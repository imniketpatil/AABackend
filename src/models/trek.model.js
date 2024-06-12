import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const trekSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "moderate", "hard"],
    required: true,
  },
  price: { type: Number, required: true },
  trekType: { type: Schema.Types.ObjectId, ref: "TrekType", required: true },
  createdAt: { type: Date, default: Date.now },
  guides: [{ type: Schema.Types.ObjectId, ref: "TrekGuide" }],
  images: [{ type: String }], // Array of image URLs
});

trekSchema.plugin(mongooseAggregatePaginate);

export const Trek = mongoose.model("Trek", trekSchema);
