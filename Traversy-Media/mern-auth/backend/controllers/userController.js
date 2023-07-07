import asyncHandler from "express-async-handler";
/**
 * Auth user/set token
 * Post api/users/auth
 * acsess public
 */
const authUser = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "Auth User" });
});
export { authUser };
