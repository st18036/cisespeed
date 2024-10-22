import { Schema, model, Document } from 'mongoose';

interface IdCounter extends Document {
  sequenceValue: number;
}

const idCounterSchema = new Schema<IdCounter>({
  sequenceValue: { type: Number, default: 0 }
});

const IdCounterModel = model<IdCounter>('IdCounter', idCounterSchema);

export default IdCounterModel;
