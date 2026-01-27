import { generateError, getErrorMessage } from "../shared/helper.js";

export const handleValidation = (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log("This is the error :", errors);

    if (!errors.isEmpty()) {
      const error = errors.array();
      const errorMessage = getErrorMessage(error);
      return generateError(errorMessage, 422);
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
