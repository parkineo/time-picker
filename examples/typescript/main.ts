import TimePicker, { TimePickerOptions } from '@parkineo/time-picker';

const options: TimePickerOptions = {
    format: '12h',
    minTime: '09:00',
    maxTime: '17:00',
    onChange: (time: string, formattedTime: string) => {
        console.log(`Selected: ${formattedTime}`);
    }
};

const picker = new TimePicker('#time-input', options);

// Type-safe API calls
const currentTime: string = picker.getValue();
picker.setValue('14:30');
