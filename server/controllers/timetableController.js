const User = require('../models/User');

exports.generateAndSave = async (req, res) => {
  try {
    const { userId, examName, subjects, startDate, gapDays, holidays, slots } = req.body;

    // --- GREEDY ALGORITHM START ---
    let timetable = [];
    let currentDate = new Date(startDate);
    const holidayList = holidays.map(h => new Date(h).toDateString());

    subjects.forEach((subject, index) => {
      let assigned = false;
      
      while (!assigned) {
        // 1. Check if Sunday or Holiday
        const isSunday = currentDate.getDay() === 0;
        const isHoliday = holidayList.includes(currentDate.toDateString());

        if (isSunday || isHoliday) {
          currentDate.setDate(currentDate.getDate() + 1);
          continue;
        }

        // 2. Assign Slot (Greedy approach: Pick first available slot for the day)
        // Yahan simple logic hai: Ek subject per day. Advanced mein multiple slots per day ho sakte hain.
        timetable.push({
          subject: subject,
          date: currentDate.toDateString(),
          slot: slots[0] || "10:00 AM - 01:00 PM"
        });

        // 3. Increment by gapDays + 1 for next exam
        currentDate.setDate(currentDate.getDate() + (parseInt(gapDays) + 1));
        assigned = true;
      }
    });
    // --- GREEDY ALGORITHM END ---

    // Save to User History in MongoDB
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.history.unshift({
          examName,
          generatedAt: new Date(),
          timetableData: timetable
        });
        await user.save();
      }
    }

    res.json({ success: true, timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Algorithm Error" });
  }
};