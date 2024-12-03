const mongoose = require("mongoose");
const Booking = require("../models/Booking"); // Import โมเดล Booking จากไฟล์โมเดล

// ฟังก์ชันสำหรับดึงรายการ Booking ทั้งหมด
exports.getBookings = async (req, res) => {
  try {
    // ดึงข้อมูล Booking ทั้งหมดและใช้ populate เพื่อดึงข้อมูล manager และ teamMember
    const bookings = await Booking.find()
      .populate("manager", "name") // ดึงเฉพาะฟิลด์ "name" ของ manager
      .populate("teamMember", "name"); // ดึงเฉพาะฟิลด์ "name" ของ teamMember
    res.status(200).json(bookings); // ส่งข้อมูลกลับในรูปแบบ JSON
  } catch (error) {
    res.status(400).json({ message: error.message }); // จัดการข้อผิดพลาด
  }
};

// ฟังก์ชันสำหรับสร้าง Booking ใหม่
exports.createBooking = async (req, res) => {
  try {
    const { manager_id, slot, duration, staff_id } = req.body; // ดึงค่าที่รับมาจาก body ของ request

    // ตรวจสอบว่า manager_id และ staff_id เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(manager_id) || !mongoose.Types.ObjectId.isValid(staff_id)) {
      return res.status(400).json({ message: "Invalid manager_id or staff_id" });
    }

    // แปลง manager_id และ staff_id ให้เป็น ObjectId
    const managerObjectId = new mongoose.Types.ObjectId(manager_id);
    const staffObjectId = new mongoose.Types.ObjectId(staff_id);

    // ตรวจสอบว่าช่วงเวลาที่จะจองซ้ำกับรายการที่มีอยู่หรือไม่
    const overlapping = await Booking.findOne({
      manager: managerObjectId,
      slot: { $lte: new Date(new Date(slot).getTime() + duration * 60000) }, // ช่วงเวลาจบของ slot
    });

    if (overlapping) {
      return res.status(400).json({ message: "Time slot overlaps with an existing booking." });
    }

    // สร้างเอกสาร Booking ใหม่
    const booking = new Booking({
      manager: managerObjectId, // ObjectId ของ manager
      teamMember: staffObjectId, // ObjectId ของ teamMember
      slot, // เวลาที่จอง
      duration, // ระยะเวลา
    });

    await booking.save(); // บันทึกข้อมูลลง MongoDB
    res.status(201).json({ message: "created", booking }); // ส่งข้อมูลกลับพร้อมสถานะการสร้างสำเร็จ
  } catch (error) {
    res.status(400).json({ message: error.message }); // จัดการข้อผิดพลาด
  }
};

// ฟังก์ชันสำหรับอัปเดต Booking
exports.updateBooking = async (req, res) => {
  try {
    const { meeting_id } = req.params; // ดึง meeting_id จากพารามิเตอร์ของ URL
    const { slot, duration } = req.body; // ดึงค่าที่ต้องการอัปเดตจาก body

    // ตรวจสอบว่า meeting_id เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(meeting_id)) {
      return res.status(400).json({ message: "Invalid meeting_id" });
    }

    // อัปเดต Booking ตาม meeting_id
    const booking = await Booking.findByIdAndUpdate(
      meeting_id,
      { slot, duration }, // ข้อมูลที่ต้องการอัปเดต
      { new: true } // ส่งกลับข้อมูลที่อัปเดตแล้ว
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" }); // หากไม่พบ Booking

    res.status(200).json({ message: "updated", booking }); // ส่งข้อมูลกลับเมื่ออัปเดตสำเร็จ
  } catch (error) {
    res.status(400).json({ message: error.message }); // จัดการข้อผิดพลาด
  }
};

// ฟังก์ชันสำหรับลบ Booking
exports.deleteBooking = async (req, res) => {
  try {
    const { meeting_id } = req.params; // ดึง meeting_id จากพารามิเตอร์ของ URL

    // ตรวจสอบว่า meeting_id เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!mongoose.Types.ObjectId.isValid(meeting_id)) {
      return res.status(400).json({ message: "Invalid meeting_id" });
    }

    // ลบ Booking ตาม meeting_id
    const booking = await Booking.findByIdAndDelete(meeting_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" }); // หากไม่พบ Booking

    res.status(200).json({ message: "deleted" }); // ส่งข้อความยืนยันการลบสำเร็จ
  } catch (error) {
    res.status(400).json({ message: error.message }); // จัดการข้อผิดพลาด
  }
};