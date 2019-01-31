import * as mongoose from 'mongoose';

//Interace for mongoose
export interface Letters extends mongoose.Document
{
    letter: string;
    quantity: number;
    value: number;
}
export const lettersSchema = new mongoose.Schema({
    letter: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    value: { type: Number, required: true }
});
export default mongoose.model<Letters>('Letters', lettersSchema);
