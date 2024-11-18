import { create } from 'zustand';

const useSelectedDateStore = create((set) => ({
  selectedDate: new Date(), 
  setSelectedDate: (date) => set({ selectedDate: date }),

  specialDays: [], 
  setSpecialDay: (date, task) => set((state) => {
    const newSpecialDay = { date, task };
    return { specialDays: [...state.specialDays, newSpecialDay] };
  }),

  getTasksForDate: (date) => {
    return set((state) => {
      return state.specialDays.filter((specialDay) =>
        new Date(specialDay.date).toDateString() === new Date(date).toDateString()
      );
    });
  },
}));

export default useSelectedDateStore;
