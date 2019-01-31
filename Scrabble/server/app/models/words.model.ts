import * as mongoose from 'mongoose';

//Interace for mongoose
export interface Words extends mongoose.Document {
    word: string;
}
export const wordsSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true },
});
export default mongoose.model<Words>('Words', wordsSchema);
