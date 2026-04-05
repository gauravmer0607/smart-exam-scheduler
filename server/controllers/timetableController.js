const User = require('../models/User');

/**
 * HELPER: Date format DD-MM-YYYY (Display purpose)
 */
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * HELPER: Format YYYY-MM-DD (Comparison purpose)
 * Corrects timezone offset by extracting parts manually
 */
const getYYYYMMDD = (date) => {
    const d = new Date(date);
    return d.getFullYear() + "-" + 
           String(d.getMonth() + 1).padStart(2, '0') + "-" + 
           String(d.getDate()).padStart(2, '0');
};

/**
 * LOGIC: Checks if the given date is a Sunday or a manual holiday
 */
const isRestDay = (date, holidays) => {
    const day = date.getDay(); // 0 = Sunday
    const dateString = getYYYYMMDD(date); 
    return day === 0 || (holidays && holidays.includes(dateString));
};

/**
 * MAIN: Algorithm to generate conflict-free timetable
 */
exports.generateAndSave = async (req, res) => {
    try {
        const { userId, examName, subjects, startDate, examType, holidays } = req.body;

        // 1. DAA Logic: Pre-calculate valid working days (Filtering Constraints)
        let workingDays = [];
        let tempDate = new Date(startDate);
        tempDate.setHours(12, 0, 0, 0); // Noon offset to avoid DST jumps

        for (let i = 0; i < 60; i++) {
            if (!isRestDay(tempDate, holidays)) {
                workingDays.push(new Date(tempDate));
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }

        // 2. Data Partitioning: Grouping by Course + Year
        const groups = {};
        subjects.forEach(sub => {
            const year = Math.ceil(parseInt(sub.sem) / 2);
            const key = `${sub.course}_Year${year}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(sub);
        });

        let timetable = [];

        // 3. Mapping: Core Scheduling Algorithm
        Object.keys(groups).forEach(key => {
            const groupSubjects = groups[key];
            const year = Math.ceil(parseInt(groupSubjects[0].sem) / 2);
            const isGroupB = (year === 3 || year === 4);

            groupSubjects.forEach((sub, index) => {
                let examDate;
                let timeSlot;

                if (examType === 'Mid-Sem') {
                    // MID-SEM: Direct mapping to working days (Daily Sequence)
                    examDate = workingDays[index];
                    timeSlot = ["09:30 AM-11:00 AM", "11:30 AM-01:00 PM", "01:30 PM-03:00 PM", "03:30 PM-05:00 PM"][year - 1];
                } else {
                    // END-SEM: Alternate Day Rotation Logic
                    const dayOffset = isGroupB ? 1 : 0;
                    const dayIndex = dayOffset + (index * 2);
                    examDate = workingDays[dayIndex];
                    timeSlot = { 1: "09:30 AM-12:30 PM", 2: "01:30 PM-04:30 PM", 3: "09:30 AM-12:30 PM", 4: "01:30 PM-04:30 PM" }[year];
                }

                if (examDate) {
                    timetable.push({
                        date: formatDate(examDate),
                        day: examDate.toLocaleDateString('en-US', { weekday: 'long' }),
                        time: timeSlot,
                        course: sub.course,
                        sem: sub.sem,
                        subjectName: sub.subject_name || sub.subjectName,
                        subjectCode: sub.subject_code || sub.subjectCode
                    });
                }
            });
        });

        // 4. Persistence: Saving generated result to User History
        if (userId) {
            await User.findByIdAndUpdate(userId, {
                $push: { 
                    history: { 
                        $each: [{ 
                            examName: examName || `${examType} - ${new Date().getFullYear()}`, 
                            examType, 
                            generatedAt: new Date(), 
                            timetableData: timetable 
                        }], 
                        $position: 0 
                    } 
                }
            });
        }

        res.json({ success: true, timetable });
    } catch (err) {
        console.error("Scheduling Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};