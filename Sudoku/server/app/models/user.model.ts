import * as mongoose from 'mongoose';

//Interace for mongoose
export interface UserDoc extends mongoose.Document {
  username: string;
  password: string;
  bestTimeSudokuEasy: number;
  bestTimeSudokuHard: number;
  bestScoreCurlingEasy: number;
  bestScoreCurlingHard: number;
}
export const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bestTimeSudokuEasy: { type: Number, required: false },
  bestTimeSudokuHard: { type: Number, required: false },
  bestScoreCurlingEasy: { type: Number, required: false },
  bestScoreCurlingHard: { type: Number, required: false }
});
export default mongoose.model<UserDoc>('UserDoc', userSchema);
