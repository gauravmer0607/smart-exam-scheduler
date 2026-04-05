import React, { useState } from 'react';
import { Upload, Trash2, Loader2, FileDown, Plus } from 'lucide-react';
import Papa from 'papaparse';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Generate = () => {
  const [formData, setFormData] = useState({ startDate: '', examType: 'Mid-Sem' });
  const [holidays, setHolidays] = useState([]);
  const [currentHoliday, setCurrentHoliday] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [groupedSchedule, setGroupedSchedule] = useState({});
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  // --- CONFIGURATION ---
  const BACKEND_URL = "https://smart-exam-scheduler-jwva.onrender.com";

  // PDF Generation Logic (Same as before)
  const downloadAllInOnePDF = () => {
    try {
      const doc = new jsPDF('l', 'mm', 'a4'); 
      const groups = Object.keys(groupedSchedule);
      if (groups.length === 0) return;

      groups.forEach((group, index) => {
        if (index > 0) doc.addPage();
        doc.setFontSize(18);
        doc.setTextColor(37, 99, 235);
        doc.text(`TIMECODES: ${group.replace('_', ' ')} Exam Schedule`, 14, 15);
        
        const tableColumn = ["Date", "Day", "Timing", "Course", "Sem", "Subject Code", "Subject Name"];
        const tableRows = groupedSchedule[group].map(row => [
          row.date || '', row.day || '', row.time || '', row.course || '', row.sem || '', row.subjectCode || '', row.subjectName || ''
        ]);

        autoTable(doc, {
          startY: 28,
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
          styles: { fontSize: 8, cellPadding: 3 },
          columnStyles: { 6: { cellWidth: 60 } }
        });
      });
      doc.save(`Exam_Schedule_${formData.examType}.pdf`);
    } catch (error) {
      console.error("PDF Export failed", error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.split('.').pop().toLowerCase() === 'csv') {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => setSubjects(results.data),
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const addHoliday = () => {
    if (currentHoliday && !holidays.includes(currentHoliday)) {
      setHolidays([...holidays, currentHoliday]);
      setCurrentHoliday('');
    }
  };

  // --- MAIN GENERATION LOGIC ---
  const generateSchedule = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert("Session expired. Please login again.");
      return;
    }

    if (!formData.startDate || subjects.length === 0) {
      alert("Missing data: Select date and upload CSV.");
      return;
    }
    
    setLoading(true);
    try {
      const monthYear = new Date(formData.startDate).toLocaleString('default', { month: 'short', year: 'numeric' });
      const customExamName = `${formData.examType} - ${monthYear}`;

      // POST Request to Render Backend
      const response = await axios.post(`${BACKEND_URL}/api/timetable/generate`, {
        userId: userId, 
        examName: customExamName,
        subjects,
        startDate: formData.startDate,
        examType: formData.examType,
        holidays
      });

      if (response.data.success) {
        const schedule = response.data.timetable;
        const groups = {};
        schedule.forEach(item => {
          const key = `${item.course}_Sem${item.sem}`;
          if (!groups[key]) groups[key] = [];
          groups[key].push(item);
        });
        setGroupedSchedule(groups);
        // Custom event to sync history if needed
        window.dispatchEvent(new Event("historyUpdated"));
      }
    } catch (err) {
      console.error("Scheduling Error:", err);
      alert(err.response?.data?.message || "Server Error: Scheduling failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070e1b] py-16 px-8 text-white">
      <div className="max-w-[1400px] mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Timetable <span className="text-blue-500">Generator</span>
          </h1>
        </header>

        {/* Configuration Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-8 rounded-t-3xl border-t border-x border-white/10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Date</label>
            <input 
              type="date" 
              onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
              className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exam Type</label>
            <select 
              onChange={(e) => setFormData({...formData, examType: e.target.value})} 
              className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500 transition-all"
            >
              <option value="Mid-Sem">Mid-Sem</option>
              <option value="End-Sem">End-Sem</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Data Import (.csv)</label>
            <label className="flex items-center justify-center gap-3 w-full h-[58px] border-2 border-dashed rounded-xl cursor-pointer bg-slate-900 border-white/10 hover:border-blue-500/50 transition-all">
              <Upload size={20} className={fileName ? 'text-blue-400' : 'text-slate-500'} />
              <span className="text-sm font-bold truncate px-2">{fileName || "Choose File"}</span>
              <input type="file" onChange={handleFileUpload} className="hidden" accept=".csv" />
            </label>
          </div>
        </section>

        {/* Holiday Management */}
        <section className="bg-white/5 p-8 rounded-b-3xl border-b border-x border-white/10 border-t border-white/5">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exclude Dates (Holidays)</label>
              <input 
                type="date" 
                value={currentHoliday} 
                onChange={(e) => setCurrentHoliday(e.target.value)} 
                className="w-full bg-slate-900 border border-white/10 p-4 rounded-xl outline-none" 
              />
            </div>
            <button 
              onClick={addHoliday} 
              className="bg-white text-black px-8 py-4 rounded-xl font-bold uppercase text-xs hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <Plus size={16}/> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {holidays.map(h => (
              <span key={h} className="bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-400 flex items-center gap-2">
                {h} <Trash2 size={12} className="cursor-pointer" onClick={() => setHolidays(holidays.filter(x => x !== h))} />
              </span>
            ))}
          </div>
        </section>

        {/* Action Controls */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={generateSchedule} 
            disabled={loading} 
            className="w-full py-5 rounded-2xl font-black uppercase bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all text-lg shadow-xl shadow-blue-600/20"
          >
            {loading ? <Loader2 className="animate-spin mx-auto text-white" /> : "Generate Schedules"}
          </button>

          {Object.keys(groupedSchedule).length > 0 && (
            <button 
              onClick={downloadAllInOnePDF} 
              className="w-full py-4 rounded-2xl font-black uppercase bg-white/10 border border-white/20 hover:bg-white/20 flex items-center justify-center gap-3 transition-all"
            >
              <FileDown size={20} className="text-blue-400" /> Export PDF (All Semesters)
            </button>
          )}
        </div>

        {/* Output Tables */}
        <section className="space-y-12">
          {Object.keys(groupedSchedule).map((group) => (
            <div key={group} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 overflow-hidden">
              <h2 className="text-xl font-black uppercase tracking-wider mb-6 pl-4 border-l-4 border-blue-600">
                {group.replace('_', ' ')}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-[10px] font-black uppercase text-slate-500">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Day</th>
                      <th className="p-4">Timing</th>
                      <th className="p-4">Course</th>
                      <th className="p-4">Sem</th>
                      <th className="p-4">Subject Name</th>
                      <th className="p-4">Subject Code</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {groupedSchedule[group].map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 font-bold text-blue-400">{row.date}</td>
                        <td className="p-4 uppercase font-bold text-slate-300">{row.day}</td>
                        <td className="p-4 font-mono text-xs text-blue-200">{row.time}</td>
                        <td className="p-4 uppercase">{row.course}</td>
                        <td className="p-4">{row.sem}</td>
                        <td className="p-4 font-medium">{row.subjectName}</td>
                        <td className="p-4 font-mono text-xs text-slate-400 bg-white/5">{row.subjectCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Generate;