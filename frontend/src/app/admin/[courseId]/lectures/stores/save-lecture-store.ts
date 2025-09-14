import { create } from "zustand";

type SaveLectureState = {
  open: boolean;
  isEdit: boolean;
  selectedLessonId?: string;
  handleOpenSaveLesson: (lessonId?: string) => void;
  handleCloseSaveLesson: () => void;
};

export const useSaveLectureStore = create<SaveLectureState>((set) => ({
  open: true,
  isEdit: false,
  selectedLessonId: undefined,
  handleOpenSaveLesson: (lessonId) => {
    set({
      open: true,
      isEdit: !!lessonId,
      selectedLessonId: lessonId,
    });
  },
  handleCloseSaveLesson: () => {
    set({
      open: false,
      isEdit: false,
      selectedLessonId: undefined,
    });
  },
}));
