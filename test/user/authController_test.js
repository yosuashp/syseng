const sinon = require('sinon')
const chai = require('chai');
const jwt = require('jsonwebtoken')
const chaiHttp = require('chai-http');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const authController = require('../../app/controllers/api/v1/authController')
// const {authorize} = require ('../../app/controllers/api/v1/authController')
const userService = require('../../app/services/userService')
// const encryption = require('../../config/encryption');

describe('authController', function() {
  afterEach(function() {
    sinon.restore()
  })

  describe('login', function() {
    it('should respond with an error for missing fields', async function() {
      const req = { body: {} }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      }

      await authController.login(req, res)

      sinon.assert.calledWith(res.status, 422)
      sinon.assert.calledWith(res.json, {
        status: 'failed',
        message: 'Missing fields required'
      })
    })

    it('should respond with an error for unregistered email', async function() {
      const req = { body: { email: 'nonexistent@example.com', password: 'password' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      }

      sinon.stub(userService, 'getByEmail').resolves(null)

      await authController.login(req, res)

      sinon.assert.calledWith(res.status, 401)
      sinon.assert.calledWith(res.json, {
        status: 'failed',
        message: 'Email is not registered'
      })
    })

    it('should respond with success for correct email and password', async function() {
      const req = { body: { email: 'sahatparulian85@gmail.com', password: 'sahat85' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      }

      const user = {
        id: 1,
        name: 'Sahat Parulian',
        email: 'sahatparulian85@gmail.com',
        role: 'superadmin',
        encryptedPassed: '$2a$10$6emtwlJF9wP08e4bKeADSOK0NoThlWynsole0w7F6dnRNO3PSap.2',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      sinon.stub(userService, 'getByEmail').resolves(user)
      sinon.stub(authController, 'checkPassword').resolves(true)

      await authController.login(req, res)

      sinon.assert.calledOnce(res.status)
      sinon.assert.calledWithExactly(res.status, 201)
      sinon.assert.calledWith(res.json, {
        status: 'success',
        message: 'login successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: sinon.match.string,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })

    it('should respond with an error for incorrect password', async function() {
      const req = { body: { email: 'registered@example.com', password: 'wrongpassword' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      }

      const user = {
        id: 1,
        name: 'John Doe',
        email: 'registered@example.com',
        role: 'member',
        encryptedPassed: '$2a$10$Nq7HSGfv9Phh3C4mAPXoJeg1juA7Y6R3qFT17kd2YqYRBr7bOB1fy',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      sinon.stub(userService, 'getByEmail').resolves(user)
      sinon.stub(authController, 'checkPassword').resolves(false)

      await authController.login(req, res)

      sinon.assert.calledWith(res.status, 401)
      sinon.assert.calledWith(res.json, {
        status: 'failed',
        message: 'Wrong password'
      })
    })
  })
  
})

describe('authController2', function() {
  describe('checkPassword', function() {
    it('should return true for correct password', async function() {
      const encryptedPassed = '$2a$10$Nq7HSGfv9Phh3C4mAPXoJeg1juA7Y6R3qFT17kd2YqYRBr7bOB1fy';
      const password = 'password';

      const result = await authController.checkPassword(encryptedPassed, password);
      expect(result).to.be.false;
    });

    it('should return false for incorrect password', async function() {
      const encryptedPassed = '$2a$10$Nq7HSGfv9Phh3C4mAPXoJeg1juA7Y6R3qFT17kd2YqYRBr7bOB1fy';
      const password = 'wrongpassword';

      const result = await authController.checkPassword(encryptedPassed, password);
      expect(result).to.be.false;
    });
  });

  describe('createToken', function() {
    it('should create a valid token', function() {
      const payload = { id: 1, email: 'test@example.com' };
      const token = authController.createToken(payload);
      expect(token).to.be.a('string');
    });
  });

  describe('authorize', function() {
    it('should authorize with valid token and allowed role', async function() {
      const req = {
        headers: {
          authorization: 'Bearer validTokenHere'
        }
      };
      const res = {};
      const next = sinon.spy();

      const user = { id: 1, role: 'admin' };
      const tokenPayload = { id: 1 };

      const userServiceStub = sinon.stub(userService, 'get').resolves(user);
      const jwtVerifyStub = sinon.stub(jwt, 'verify').returns(tokenPayload);

      await authController.authorize(req, res, next, ['admin']);

      expect(userServiceStub).to.have.been.calledOnce;
      expect(jwtVerifyStub).to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;

      userServiceStub.restore();
      jwtVerifyStub.restore();
    });

    it('should not authorize with invalid token', async function() {
      const req = {
        headers: {
          authorization: 'Bearer invalidTokenHere'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.spy();

      const jwtVerifyStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

      await authController.authorize(req, res, next, ['admin']);

      expect(res.status).to.have.been.calledWith(401);
      expect(res.json).to.have.been.calledWith({ status: 'failed', message: 'Unauthorized' });
      expect(next).to.not.have.been.called;

      jwtVerifyStub.restore();
    });

    it('should not authorize with invalid role', async function() {
      const req = {
        headers: {
          authorization: 'Bearer validTokenHere'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.spy();

      const user = { id: 1, role: 'user' };
      const tokenPayload = { id: 1 };

      const userServiceStub = sinon.stub(userService, 'get').resolves(user);
      const jwtVerifyStub = sinon.stub(jwt, 'verify').returns(tokenPayload);

      await authController.authorize(req, res, next, ['admin']);

      expect(res.status).to.have.been.calledWith(401);
      expect(res.json).to.have.been.calledWith({ status: 'failed', message: 'Unauthorized' });
      expect(next).to.not.have.been.called;

      userServiceStub.restore();
      jwtVerifyStub.restore();
    });
  });

  
  
});

describe('authController4', function() {
  describe('loginAdmin', function() {
    let getByEmailStub;
    let checkPasswordStub;

    beforeEach(function () {
      getByEmailStub = sinon.stub(userService, 'getByEmail');
      checkPasswordStub = sinon.stub(authController, 'checkPassword');
    });

    afterEach(function () {
      getByEmailStub.restore();
      checkPasswordStub.restore();
    });

    it('should return missing fields error if email or password is not provided', async function() {
      const req = { body: {} };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      await authController.loginAdmin(req, res);

      sinon.assert.calledWith(res.status, 422);
      sinon.assert.calledWith(res.json, { status: 'failed', message: 'Missing fields required' });
    });

    it('should return unauthorized error if user is not found or not a superadmin', async function() {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      getByEmailStub.resolves({ role: 'user' });

      await authController.loginAdmin(req, res);

      sinon.assert.calledWith(res.status, 401);
      sinon.assert.calledWith(res.json, { status: 'failed', message: 'Unauthorized' });
    });

    it('should respond with an error for incorrect password', async function() {
      const req = { body: { email: 'registered@example.com', password: 'wrongpassword' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      }

      const user = {
        id: 1,
        name: 'John Doe',
        email: 'sahatparulian85@gmail.com',
        role: 'superadmin',
        encryptedPassed: '$2a$10$Nq7HSGfv9Phh3C4mAPXoJeg1juA7Y6R3qFT17kd2YqYRBr7bOB1fy',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      getByEmailStub.resolves(user);
      checkPasswordStub.resolves(false);

      await authController.loginAdmin(req, res);

      sinon.assert.calledWith(res.status, 401);
      sinon.assert.calledWith(res.json, {
        status: 'failed',
        message: 'Wrong password'
      });
    });

    it('should respond with success for correct email and password', async function() {
      const req = { body: { email: 'sahatparulian85@gmail.com', password: 'sahat85' } }
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      }

      const user = {
        id: 1,
        name: 'Sahat Parulian',
        email: 'sahatparulian85@gmail.com',
        role: 'superadmin',
        encryptedPassed: '$2a$10$6emtwlJF9wP08e4bKeADSOK0NoThlWynsole0w7F6dnRNO3PSap.2',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      getByEmailStub.resolves(user);
  checkPasswordStub.resolves(true);

      await authController.login(req, res)

      sinon.assert.calledOnce(res.status)
      sinon.assert.calledWithExactly(res.status, 201)
      sinon.assert.calledWith(res.json, {
        status: 'success',
        message: 'login successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: sinon.match.string,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })
  });
});