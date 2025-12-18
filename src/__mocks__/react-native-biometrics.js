module.exports = jest.fn().mockImplementation(() => ({
  isSensorAvailable: jest.fn().mockResolvedValue({available: false}),
  simplePrompt: jest.fn().mockResolvedValue({success: false}),
}));
