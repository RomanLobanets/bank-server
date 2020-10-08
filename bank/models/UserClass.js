class UserClass {
  static findUserByIdAndUpdate(userId, updatedParams) {
    return this.findByIdAndUpdate(
      userId,
      { $set: updatedParams },
      { new: true }
    );
  }

  static async findUserByEmail(email) {
    return this.findOne({ email });
  }

  static async createVerificationToken(userId, token) {
    return this.findByIdAndUpdate(
      userId,
      { verificationToken: token },
      { new: true }
    );
  }

  static async findByVerificationToken(verificationToken) {
    return this.findOne({ verificationToken });
  }

  static async verifyUser(userId) {
    return this.findByIdAndUpdate(userId, {
      status: true,
      $unset: { verificationToken: 1 },
    });
  }

  static async changeEmail(userId) {
    return this.findByIdAndUpdate(userId, {
      status: false,
    });
  }

  // static async updateToken(id, token) {
  //   return this.findByIdAndUpdate(id, { token }, { new: true });
  // }
}
module.exports = UserClass;
