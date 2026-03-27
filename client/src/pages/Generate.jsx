import React, { useState } from 'react';
import { Calendar, Upload, Download, Table as TableIcon, Trash2, Clock, FileCheck, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';

const Generate = () => {
  const [formData, setFormData] = useState({ startDate: '', examType: 'Mid-Sem' });
  const [holidays, setHolidays] = useState([]);
  const [currentHoliday, setCurrentHoliday] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [groupedSchedule, setGroupedSchedule] = useState({});
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setSubjects(results.data),
      });
    }
  };

  const addHoliday = () => {
    if (currentHoliday && !holidays.includes(currentHoliday)) {
      setHolidays([...holidays, currentHoliday]);
      setCurrentHoliday('');
    }
  };

  // --- Main DAA & Backend Connection ---
  const generateSchedule = async () => {
    setLoading(true);
    
    // Step 1: Group subjects for the Algorithm
    const groups = {};
    subjects.forEach(sub => {
      const key = `${sub.course}_Sem${sub.sem}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(sub);
    });

    const finalOutput = {};
    const timing = formData.examType === 'Mid-Sem' ? '10:00 AM - 12:00 PM' : '10:00 AM - 01:00 PM';

    // Step 2: Run Greedy Algorithm (Frontend Preview)
    Object.keys(groups).forEach(groupKey => {
      let current = new Date(formData.startDate);
      let schedule = [];
      
      groups[groupKey].forEach(sub => {
        // Holiday & Sunday skip logic
        while (current.getDay() === 0 || holidays.includes(current.toISOString().split('T')[0])) {
          current.setDate(current.getDate() + 1);
        }
        
        schedule.push({
          date: current.toDateString(),
          timing: timing,
          course: sub.course,
          sem: sub.sem,
          subjectName: sub.subject_name,
          subjectCode: sub.subject_code
        });
        current.setDate(current.getDate() + 1);
      });
      finalOutput[groupKey] = schedule;
    });

    setGroupedSchedule(finalOutput);

    // Step 3: Save to Backend History
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post("http://localhost:5000/api/timetable/save-history", {
          examName: `${formData.examType} - ${new Date().getFullYear()}`,
          examType: formData.examType,
          timetableData: finalOutput
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("History saved to cloud!");
      } catch (err) {
        console.error("Failed to save history:", err);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#070e1b] py-16 px-8 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-black tracking-tighter text-center uppercase">Timetable <span className="text-blue-500">Generator</span></h1>

        {/* --- Configuration --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date</label>
            <input type="date" onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-white" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exam Type</label>
            <select onChange={(e) => setFormData({...formData, examType: e.target.value})} className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-white">
              <option value="Mid-Sem">Mid-Sem</option>
              <option value="End-Sem">End-Sem</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subject List</label>
            <label className={`flex items-center justify-center gap-3 w-full h-[58px] border-2 border-dashed rounded-xl cursor-pointer transition-all ${subjects.length > 0 ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-900 border-white/10 hover:border-blue-500/50'}`}>
              {subjects.length > 0 ? <FileCheck className="text-blue-400" size={20}/> : <Upload className="text-slate-500" size={20} />}
              <span className={`text-sm font-bold ${subjects.length > 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                {fileName ? fileName : "Import CSV"}
              </span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".csv" />
            </label>
          </div>
        </div>

        {/* --- Holiday Manager --- */}
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="flex gap-4 mb-4 relative z-10">
            <input type="date" value={currentHoliday} onChange={(e) => setCurrentHoliday(e.target.value)} className="bg-slate-900 border border-white/10 p-3 rounded-xl flex-grow outline-none focus:border-red-500/50 transition-all text-white" />
            <button onClick={addHoliday} className="bg-white text-black px-8 rounded-xl font-black text-xs uppercase tracking-tighter hover:bg-slate-200 transition-all">Add Holiday</button>
          </div>
          <div className="flex flex-wrap gap-2 relative z-10">
            {holidays.length === 0 && <p className="text-slate-600 text-xs italic ml-2">No holidays added yet...</p>}
            {holidays.map(h => (
              <span key={h} className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full text-[10px] font-black flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                {h} <Trash2 size={12} className="cursor-pointer text-red-500 hover:scale-125 transition-transform" onClick={() => setHolidays(holidays.filter(x => x !== h))} />
              </span>
            ))}
          </div>
        </div>

        {/* --- Generate Button --- */}
        <button 
          onClick={generateSchedule} 
          disabled={subjects.length === 0 || !formData.startDate || loading}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-lg transition-all duration-500 flex items-center justify-center gap-3 ${
            subjects.length > 0 && formData.startDate
            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)]' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : (subjects.length === 0 ? "Please Import CSV First" : "Generate Schedules")}
        </button>

        {/* --- Results Section --- */}
        {Object.keys(groupedSchedule).length > 0 && (
          <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 pb-20">
            {Object.keys(groupedSchedule).map((group) => (
              <div key={group} className="space-y-4">
                <div className="flex justify-between items-center">
                   <h2 className="text-xl font-black text-blue-400 uppercase tracking-wider px-2 border-l-4 border-blue-600">
                     {group.replace('_', ' ')}
                   </h2>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/10">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Timing</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Sem</th>
                        <th className="p-4">Subject Code</th>
                        <th className="p-4">Subject Name</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {groupedSchedule[group].map((row, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-bold">{row.date}</td>
                          <td className="p-4 text-slate-400 font-medium">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-blue-500"/> {row.timing}
                            </div>
                          </td>
                          <td className="p-4 uppercase">{row.course}</td>
                          <td className="p-4">{row.sem}</td>
                          <td className="p-4 font-mono text-blue-300 bg-blue-500/5">{row.subjectCode}</td>
                          <td className="p-4">{row.subjectName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;