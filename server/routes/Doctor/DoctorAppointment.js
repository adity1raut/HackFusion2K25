import express from 'express';
import DoctorAppointment from '../../models/DoctorAppointment.js'; // Adjust the path as needed
import transporter from '../../config/NodeMailer.js'; // Import the configured transporter

const router = express.Router();

// Function to send email
const sendEmail = async (to, subject, text) => {
    // Validate the recipient email
    if (!to || typeof to !== 'string' || !to.includes('@')) {
        console.error('Invalid recipient email:', to);
        throw new Error('Invalid recipient email');
    }

    const mailOptions = {
        from: process.env.EMAIL, // Use the email from the transporter configuration
        to, // Recipient email
        subject, // Email subject
        text // Email body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw error; // Propagate the error to the caller
    }
};

// Create appointment
router.post('/api/appointments', async (req, res) => {
    const { name, email, rollno, date, time, classCordinatorEmail, parentEmail } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !rollno || !date || !time || !classCordinatorEmail || !parentEmail) {
        return res.status(400).send({ error: 'All required fields must be provided' });
    }

    try {
        const appointment = new DoctorAppointment({
            name,
            email,
            rollno,
            date,
            time,
            classCordinatorEmail,
            parentEmail
        });

        await appointment.save();
        res.status(201).send({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).send({ error: 'An error occurred while creating the appointment' });
    }
});

// Get all appointments
router.get('/api/doctor/all-appointments', async (req, res) => {
    try {
        const appointments = await DoctorAppointment.find().sort({ date: -1, time: 1 });
        res.status(200).json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update appointment (illness, bedrest, messages)
// Update appointment (illness, bedrest, messages)
router.put('/api/doctor/update-appointment/:id', async (req, res) => {
    try {
        const { illness, bedrest, messege } = req.body;

        // Find the appointment by ID
        const appointment = await DoctorAppointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Update the appointment fields
        appointment.illness = illness || appointment.illness;
        appointment.bedrest = bedrest || appointment.bedrest;
        appointment.messege = messege || appointment.messege;

        // Save the updated appointment
        const updatedAppointment = await appointment.save();

        // Get the parent and class coordinator emails from the updated appointment
        const { parentEmail, classCordinatorEmail } = updatedAppointment;

        // Log the recipient emails for debugging
        console.log('Class Coordinator Email:', classCordinatorEmail);
        console.log('Parent Email:', parentEmail);

        // Validate email addresses
        if (!classCordinatorEmail || !parentEmail) {
            return res.status(400).json({ error: 'Class coordinator email and parent email are required' });
        }

        // Send emails based on the bedrest value
        if (bedrest === true) {
            // Send email to class coordinator
            const classCoordinatorSubject = `Bedrest Required for ${updatedAppointment.name}`;
            const classCoordinatorText = `Dear Class Coordinator,\n\nBedrest has been prescribed for ${updatedAppointment.name} (Roll No: ${updatedAppointment.rollno}).\n\nMessage: ${messege || 'No additional message provided.'}\n\nRegards,\nDoctor's Office`;
            await sendEmail(classCordinatorEmail, classCoordinatorSubject, classCoordinatorText);

            // Send email to parent
            const parentSubject = `Bedrest Required for Your Child, ${updatedAppointment.name}`;
            const parentText = `Dear Parent,\n\nBedrest has been prescribed for your child, ${updatedAppointment.name} (Roll No: ${updatedAppointment.rollno}).\n\nMessage: ${messege || 'No additional message provided.'}\n\nRegards,\nDoctor's Office`;
            await sendEmail(parentEmail, parentSubject, parentText);
        } else {
            // Send email only to parent
            const parentSubject = `Appointment Update for Your Child, ${updatedAppointment.name}`;
            const parentText = `Dear Parent,\n\nAn update has been made to your child's appointment (${updatedAppointment.name}, Roll No: ${updatedAppointment.rollno}).\n\nMessage: ${messege || 'No additional message provided.'}\n\nRegards,\nDoctor's Office`;
            await sendEmail(parentEmail, parentSubject, parentText);
        }

        res.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'An error occurred while updating the appointment' });
    }
});

export default router;