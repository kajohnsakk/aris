import { validationHelper } from "../../../helpers";
const { Schema } = validationHelper;

const userValidation = {
  insert: () => {
    return {
      body: Schema.object({
        firstName: Schema.string().required(),
        lastName: Schema.string().required(),
        username: Schema.string().required(),
      }),
    };
  },
};

export default userValidation;
