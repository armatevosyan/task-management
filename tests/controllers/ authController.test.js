const { login } = require('../../controlers/auth');
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Validators } = require('../../validators/auth');
const log = require('../../helpers/logger');

// Mock dependencies
jest.mock('../../models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../helpers/logger');

jest.mock('../../validators/auth', () => ({
  Validators: {
    auth: jest.fn(),
  },
}));

describe('Login Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if validation fails', async () => {
    Validators.auth.mockReturnValue({ error: { details: [{ message: 'Validation error' }] } });

    const req = {
      body: { email: 'user@example.com', password: 'password' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
  });

  test('should return 400 if user not found', async () => {
    Validators.auth.mockReturnValue({ error: null });

    User.findOne.mockResolvedValue(null);

    const req = {
      body: { email: 'user@example.com', password: 'password' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(log.error).toHaveBeenCalledWith('Failed login attempt: Invalid credentials');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('should return 400 if password is invalid', async () => {
    Validators.auth.mockReturnValue({ error: null });

    User.findOne.mockResolvedValue({ password: 'hashedPassword' });
    bcrypt.compare.mockResolvedValue(false);

    const req = {
      body: { email: 'user@example.com', password: 'password' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(log.error).toHaveBeenCalledWith('Failed login attempt: Invalid credentials');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('should return 200 and token if login is successful', async () => {
    Validators.auth.mockReturnValue({ error: null });

    User.findOne.mockResolvedValue({ id: 1, password: 'hashedPassword' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');

    const req = {
      body: { email: 'user@example.com', password: 'password' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login success',
      data: { token: 'token' },
    });
  });

  test('should handle internal server errors', async () => {
    Validators.auth.mockReturnValue({ error: null });

    User.findOne.mockRejectedValue(new Error('Database error'));

    const req = {
      body: { email: 'user@example.com', password: 'password' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await login(req, res);

    expect(log.error).toHaveBeenCalledWith(expect.stringContaining('Catch error in the function login'));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});
