export const setAuthCookies = (res, tokens) => {
  res.setHeader("Set-Cookie", [
    serialize("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60,
    }),
    serialize("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    }),
  ]);
};

export const clearAuthCookies = (res) => {
  res.setHeader("Set-Cookie", [
    serialize("accessToken", "", {
      path: "/",
      maxAge: -1,
    }),
    serialize("refreshToken", "", {
      path: "/",
      maxAge: -1,
    }),
  ]);
};
