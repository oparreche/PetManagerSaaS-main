import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Dog, Cat, Fish, Bird, Check } from 'lucide-react';

interface BookingModal2Props {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  provider: {
    id: string;
    name: string;
    avatar?: string;
  } | null;
  onSubmit: (bookingData: any) => void;
}

const BookingModal2: React.FC<BookingModal2Props> = ({
  isOpen,
  onClose,
  service,
  provider,
  onSubmit
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('dog');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Generate available time slots when date changes
  useEffect(() => {
    if (date) {
      // Generate time slots from 9:00 AM to 6:00 PM with 30-minute intervals
      const slots = [];
      for (let hour = 9; hour <= 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          if (hour === 18 && minute > 0) break; // Stop at 6:00 PM
          const formattedHour = hour > 12 ? hour - 12 : hour;
          const formattedMinute = minute === 0 ? '00' : minute;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          slots.push(`${formattedHour}:${formattedMinute} ${ampm}`);
        }
      }
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [date]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setDate('');
      setTime('');
      setPetName('');
      setPetType('dog');
      setNotes('');
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }

    if (!time) {
      newErrors.time = 'Please select a time';
    }

    if (!petName.trim()) {
      newErrors.petName = 'Please enter your pet\'s name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        serviceId: service?.id,
        providerId: provider?.id,
        date,
        time,
        petName,
        petType,
        notes,
        status: 'pending'
      };

      await onSubmit(bookingData);
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrors({ submit: 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPetIcon = (type: string) => {
    switch (type) {
      case 'dog': return <Dog className="w-5 h-5" />;
      case 'cat': return <Cat className="w-5 h-5" />;
      case 'fish': return <Fish className="w-5 h-5" />;
      case 'bird': return <Bird className="w-5 h-5" />;
      default: return <Dog className="w-5 h-5" />;
    }
  };

  if (!isOpen || !service || !provider) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Service and Provider Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-600">Service Provider</p>
              </div>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-900">{service.name}</h4>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-gray-600">Duration: {service.duration} min</span>
                <span className="text-sm font-medium text-gray-900">${service.price}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/* Time Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Select Time
              </label>
              {date ? (
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {availableTimeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                        time === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Please select a date first</p>
              )}
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>

            {/* Pet Information */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter your pet's name"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.petName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.petName && <p className="mt-1 text-sm text-red-600">{errors.petName}</p>}
            </div>

            {/* Pet Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['dog', 'cat', 'fish', 'bird'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPetType(type)}
                    className={`py-2 px-3 rounded-lg border capitalize transition-colors flex flex-col items-center ${
                      petType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {getPetIcon(type)}
                    <span className="text-xs mt-1">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requirements or information..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Booking
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal2;