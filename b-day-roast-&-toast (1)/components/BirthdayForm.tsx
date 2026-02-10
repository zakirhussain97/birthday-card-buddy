
import React from 'react';
import { BirthdayData } from '../types';

interface BirthdayFormProps {
  onSubmit: (data: BirthdayData) => void;
  isLoading: boolean;
}

const BirthdayForm: React.FC<BirthdayFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<BirthdayData>({
    name: '',
    age: '',
    hobby: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.hobby) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-3">
        <label className="text-lg font-black text-indigo-900 flex items-center">
          <i className="fa-solid fa-user-tag mr-2 text-pink-500"></i>
          Who's the lucky victim?
        </label>
        <input
          required
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Crazy Uncle Bob"
          className="w-full px-6 py-4 rounded-2xl border-4 border-gray-50 bg-gray-50 focus:bg-white focus:border-pink-400 focus:ring-0 transition-all text-lg font-medium text-gray-700 placeholder:text-gray-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-lg font-black text-indigo-900 flex items-center">
            <i className="fa-solid fa-hourglass-half mr-2 text-yellow-500"></i>
            Current Mileage? (Age)
          </label>
          <input
            required
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full px-6 py-4 rounded-2xl border-4 border-gray-50 bg-gray-50 focus:bg-white focus:border-yellow-400 focus:ring-0 transition-all text-lg font-medium text-gray-700 placeholder:text-gray-300"
          />
        </div>
        <div className="space-y-3">
          <label className="text-lg font-black text-indigo-900 flex items-center">
            <i className="fa-solid fa-palette mr-2 text-cyan-500"></i>
            Obsession? (Hobby)
          </label>
          <input
            required
            type="text"
            name="hobby"
            value={formData.hobby}
            onChange={handleChange}
            placeholder="e.g. Competitive Napping"
            className="w-full px-6 py-4 rounded-2xl border-4 border-gray-50 bg-gray-50 focus:bg-white focus:border-cyan-400 focus:ring-0 transition-all text-lg font-medium text-gray-700 placeholder:text-gray-300"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-5 rounded-3xl text-white font-black text-2xl shadow-[0_10px_0_0_rgba(79,70,229,1)] hover:shadow-[0_5px_0_0_rgba(79,70,229,1)] hover:translate-y-[5px] active:shadow-none active:translate-y-[10px] transform transition-all flex items-center justify-center space-x-3 group ${
          isLoading 
            ? 'bg-gray-300 cursor-not-allowed shadow-none translate-y-[10px]' 
            : 'bg-indigo-600'
        }`}
      >
        {isLoading ? (
          <>
            <i className="fa-solid fa-snowflake animate-spin text-3xl"></i>
            <span>Chilling the champagne...</span>
          </>
        ) : (
          <>
            <i className="fa-solid fa-bolt text-yellow-300 group-hover:animate-pulse"></i>
            <span>CREATE THE MAGIC</span>
            <i className="fa-solid fa-bolt text-yellow-300 group-hover:animate-pulse"></i>
          </>
        )}
      </button>
    </form>
  );
};

export default BirthdayForm;
