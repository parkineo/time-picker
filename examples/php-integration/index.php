<?php
/**
 * PHP Integration Example for TimePicker
 * This example shows how to integrate the TimePicker component with PHP forms
 */

// Handle form submission
if ($_POST) {
    $meeting_time = $_POST['meeting_time'] ?? '';
    $appointment_date = $_POST['appointment_date'] ?? '';

    // Validate and process the time
    if (!empty($meeting_time)) {
        // Convert to 24h format for database storage
        $time_24h = convertTo24Hour($meeting_time);

        // Save to database (example)
        // $stmt = $pdo->prepare("INSERT INTO appointments (date, time) VALUES (?, ?)");
        // $stmt->execute([$appointment_date, $time_24h]);

        echo "<div class='alert alert-success'>Appointment scheduled for {$appointment_date} at {$meeting_time}</div>";
    }
}

function convertTo24Hour($time) {
    if (strpos($time, 'AM') !== false || strpos($time, 'PM') !== false) {
        return date('H:i', strtotime($time));
    }
    return $time; // Already in 24h format
}

function formatTimeForDisplay($time_24h) {
    return date('g:i A', strtotime($time_24h));
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TimePicker PHP Integration</title>
    <link rel="stylesheet" href="dist/time-picker.css">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }

        .form-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #374151;
        }

        input[type="date"], input[type="text"] {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
            box-sizing: border-box;
        }

        button {
            background-color: #3b82f6;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s;
        }

        button:hover {
            background-color: #2563eb;
        }

        .alert {
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
        }

        .alert-success {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }

        .examples {
            margin-top: 30px;
            padding: 20px;
            background-color: #f1f5f9;
            border-radius: 6px;
        }

        .example-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e2e8f0;
        }

        .example-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        code {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>Appointment Booking System</h1>
        <p>Schedule your appointment using our time picker component.</p>

        <form method="POST" action="">
            <div class="form-group">
                <label for="appointment_date">Appointment Date:</label>
                <input type="date"
                       id="appointment_date"
                       name="appointment_date"
                       value="<?php echo $_POST['appointment_date'] ?? date('Y-m-d'); ?>"
                       required>
            </div>

            <div class="form-group">
                <label for="meeting_time">Appointment Time:</label>
                <input type="text"
                       id="meeting_time"
                       name="meeting_time"
                       placeholder="Select appointment time"
                       value="<?php echo $_POST['meeting_time'] ?? ''; ?>"
                       required>
            </div>

            <div class="form-group">
                <label for="client_name">Client Name:</label>
                <input type="text"
                       id="client_name"
                       name="client_name"
                       placeholder="Enter your name"
                       value="<?php echo $_POST['client_name'] ?? ''; ?>"
                       required>
            </div>

            <button type="submit">Book Appointment</button>
        </form>

        <div class="examples">
            <h3>Different Time Picker Configurations</h3>

            <div class="example-item">
                <label for="time_12h">12-Hour Format (9 AM - 5 PM):</label>
                <input type="text" id="time_12h" placeholder="Business hours only">
            </div>

            <div class="example-item">
                <label for="time_24h">24-Hour Format (30-minute intervals):</label>
                <input type="text" id="time_24h" placeholder="24-hour format">
            </div>

            <div class="example-item">
                <label for="time_custom">Custom Range (10:00 - 14:00, 5-minute steps):</label>
                <input type="text" id="time_custom" placeholder="Limited time range">
            </div>

            <div class="example-item">
                <label for="time_auto">Auto-initialize with data attributes:</label>
                <input type="text"
                       data-time-picker
                       data-format="12h"
                       data-default-time="09:00"
                       data-min-time="08:00"
                       data-max-time="18:00"
                       placeholder="Auto-initialized">
            </div>
        </div>
    </div>

    <script src="dist/time-picker.js"></script>
    <script>
        // Initialize main appointment time picker
        const appointmentPicker = new TimePicker('#meeting_time', {
            format: '12h',
            minTime: '09:00',
            maxTime: '17:00',
            step: 30,
            onChange: function(time, formattedTime) {
                console.log('Appointment time selected:', formattedTime);

                // You can add validation or other logic here
                if (time < '12:00') {
                    console.log('Morning appointment');
                } else {
                    console.log('Afternoon appointment');
                }
            }
        });

        // Initialize example time pickers
        new TimePicker('#time_12h', {
            format: '12h',
            minTime: '09:00',
            maxTime: '17:00',
            step: 15
        });

        new TimePicker('#time_24h', {
            format: '24h',
            step: 30
        });

        new TimePicker('#time_custom', {
            format: '24h',
            minTime: '10:00',
            maxTime: '14:00',
            step: 5
        });

        // Form validation
        document.querySelector('form').addEventListener('submit', function(e) {
            const timeValue = document.getElementById('meeting_time').value;
            const dateValue = document.getElementById('appointment_date').value;
            const nameValue = document.getElementById('client_name').value;

            if (!timeValue || !dateValue || !nameValue) {
                e.preventDefault();
                alert('Please fill in all required fields.');
                return;
            }

            // Additional validation - no appointments on weekends
            const selectedDate = new Date(dateValue);
            const dayOfWeek = selectedDate.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) {
                e.preventDefault();
                alert('Sorry, we don\'t accept appointments on weekends. Please select a weekday.');
                return;
            }

            // Additional validation - no past dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                e.preventDefault();
                alert('Please select a future date for your appointment.');
                return;
            }
        });
    </script>
</body>
</html>

<?php
/**
 * Additional PHP helper functions for time manipulation
 */

class TimePickerHelper {

    /**
     * Convert 12-hour format to 24-hour format
     */
    public static function to24Hour($time12h) {
        if (empty($time12h)) return '';

        try {
            $dateTime = DateTime::createFromFormat('g:i A', $time12h);
            return $dateTime ? $dateTime->format('H:i') : $time12h;
        } catch (Exception $e) {
            return $time12h; // Return as-is if parsing fails
        }
    }

    /**
     * Convert 24-hour format to 12-hour format
     */
    public static function to12Hour($time24h) {
        if (empty($time24h)) return '';

        try {
            $dateTime = DateTime::createFromFormat('H:i', $time24h);
            return $dateTime ? $dateTime->format('g:i A') : $time24h;
        } catch (Exception $e) {
            return $time24h; // Return as-is if parsing fails
        }
    }

    /**
     * Validate time is within business hours
     */
    public static function isBusinessHours($time24h, $startTime = '09:00', $endTime = '17:00') {
        if (empty($time24h)) return false;

        $time = strtotime($time24h);
        $start = strtotime($startTime);
        $end = strtotime($endTime);

        return $time >= $start && $time <= $end;
    }

    /**
     * Generate time slots for a given range and interval
     */
    public static function generateTimeSlots($startTime, $endTime, $intervalMinutes = 30) {
        $slots = [];
        $start = strtotime($startTime);
        $end = strtotime($endTime);
        $interval = $intervalMinutes * 60; // Convert to seconds

        for ($time = $start; $time <= $end; $time += $interval) {
            $slots[] = date('H:i', $time);
        }

        return $slots;
    }

    /**
     * Check if a time slot is available (example for database integration)
     */
    public static function isTimeSlotAvailable($date, $time, $pdo = null) {
        if (!$pdo) return true; // Return true if no database connection

        try {
            $stmt = $pdo->prepare(
                "SELECT COUNT(*) FROM appointments WHERE appointment_date = ? AND appointment_time = ?"
            );
            $stmt->execute([$date, $time]);

            return $stmt->fetchColumn() == 0;
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return true; // Assume available on error
        }
    }
}

// Example usage:
/*
$helper = new TimePickerHelper();

// Convert formats
$time24h = $helper->to24Hour('2:30 PM');  // Returns '14:30'
$time12h = $helper->to12Hour('14:30');    // Returns '2:30 PM'

// Validate business hours
$isValid = $helper->isBusinessHours('14:30'); // Returns true

// Generate time slots
$slots = $helper->generateTimeSlots('09:00', '17:00', 30);
// Returns ['09:00', '09:30', '10:00', ..., '17:00']
*/
?>
