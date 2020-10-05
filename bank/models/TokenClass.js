class TokenClass {
  static async findByUserIdAndToken(userId, token) {
    return this.findOne({ userId, token });
  }

  static async findByUserIdAndTokenAndDelete(userId, token) {
    return this.findOneAndDelete({ userId, token });
  }
}
module.exports = TokenClass;
