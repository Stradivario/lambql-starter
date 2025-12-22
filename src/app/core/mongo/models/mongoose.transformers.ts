export const MongooseIdTransformer = {
  transform: function (doc, ret) {
    const model = {
      id: ret._id,
      ...ret,
    };
    delete model._id;
    delete model.__v;
    return model;
  },
};

export const GlobalModelOptions = {
  toObject: MongooseIdTransformer,
  toJSON: MongooseIdTransformer,
  versionKey: false,
  timestamps: true,
};
