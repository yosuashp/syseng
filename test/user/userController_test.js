const sinon = require('sinon');
const { assert } = require('chai');
const bcrypt = require('bcryptjs');
const userController = require('../../app/controllers/api/v1/userController');
const userService = require('../../app/services/userService');
const encryption = require('../../config/encryption');

describe('userController', function () {
  let req, res, next, userServiceStub, isUserExistStub;

  beforeEach(function () {
    req = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    next = sinon.spy();
    userServiceStub = sinon.stub(userService, 'create');
    isUserExistStub = sinon.stub(userService, 'isUserExist'); // Perubahan di sini
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('register', function () {
    it('should create user successfully and return JSON response', async function () {
      userServiceStub.resolves({
        id: 'userId',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      isUserExistStub.resolves(false); // Mocking user does not exist

      await userController.register(req, res, 'member');

      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 201);

      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, sinon.match({
        status: 'success',
        message: 'create user successfully',
        data: {
          id: 'userId',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'member',
          createdAt: sinon.match.date,
          updatedAt: sinon.match.date
        }
      }));
    });

    it('should handle missing required fields and return JSON response', async function () {
      req.body = {}; // Missing required fields

      await userController.register(req, res, 'member');

      sinon.assert.notCalled(userServiceStub);

      assert.strictEqual(res.status.callCount, 1);
      assert.strictEqual(res.status.firstCall.args[0], 422);
      assert.strictEqual(res.json.callCount, 1);
      assert.deepStrictEqual(res.json.firstCall.args[0], {
        status: 'error',
        message: 'Missing required fields'
      });
    });

    it('should handle existing user and return JSON response', async function () {
      isUserExistStub.resolves(true); // Simulate existing user

      await userController.register(req, res, 'member');

      sinon.assert.notCalled(userServiceStub);

      assert.strictEqual(res.status.callCount, 1);
      assert.strictEqual(res.status.firstCall.args[0], 409);
      assert.strictEqual(res.json.callCount, 1);
      assert.deepStrictEqual(res.json.firstCall.args[0], {
        status: 'failed',
        message: 'email already registered'
      });
    });

    // it('should handle user creation error and return JSON response', async function () {
    //     isUserExistStub.resolves(false); // Mocking user does not exist
    //     userServiceStub.rejects(new Error('Internal Server Error'));
    
    //     await userController.register(req, res, 'member');
    
    //     sinon.assert.calledOnce(isUserExistStub);
    //     sinon.assert.calledOnce(res.status);
    //     sinon.assert.calledWith(res.status, 500);
    
    //     sinon.assert.calledOnce(res.json);
    //     sinon.assert.calledWith(res.json, sinon.match({
    //       status: 'error',
    //       message: 'Internal Server Error'
    //     }));
    //   });
      
  });
});


describe('encryptPassword', function () {
  let hashStub;

  beforeEach(function () {
    hashStub = sinon.stub(bcrypt, 'hash');
  });

  afterEach(function () {
    sinon.restore();
  });

  it('should resolve with encrypted password', async function () {
    const password = 'password123';
    const salt = encryption.SALT;
    const encryptedPassword = 'encryptedPassword';
    hashStub.yields(null, encryptedPassword);

    try {
      const result = await userController.encryptPassword(password);

      sinon.assert.calledOnce(hashStub);
      sinon.assert.calledWith(hashStub, password, salt);

      assert.strictEqual(result, encryptedPassword);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('should reject with an error if password is invalid', async function () {
    const invalidPassword = 123;

    try {
      await userController.encryptPassword(invalidPassword);
      assert.fail('The function should have thrown an error');
    } catch (error) {
      assert.strictEqual(error.message, 'Invalid password');
    }
  });

  it('should reject with an error if bcrypt.hash encounters an error', async function () {
    const password = 'password123';
    const salt = encryption.SALT;
    const errorMessage = 'Bcrypt hash error';
    hashStub.yields(new Error(errorMessage));

    try {
      await userController.encryptPassword(password);
      assert.fail('The function should have thrown an error');
    } catch (error) {
      assert.strictEqual(error.message, errorMessage);
    }
  });
});

describe('deleteUserById', function () {
    let req, res, userServiceStub;
  
    beforeEach(function () {
      req = {
        params: {
          id: '1'
        },
        user: {
          // Mock user object, adjust accordingly based on your implementation
          id: 'loggedInUserId'
        }
      };
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      userServiceStub = sinon.stub(userService, 'get');
    });
  
    afterEach(function () {
      sinon.restore();
    });
  
    it('should delete user data successfully', async function () {
      const userId = '1';
      const userToDelete = {
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com'
        // Add other user properties based on your implementation
      };
  
      userServiceStub.resolves(userToDelete);
  
      const deleteStub = sinon.stub(userService, 'delete').resolves('Delete successful');
  
      await userController.deleteUserById(req, res);
  
      sinon.assert.calledOnce(userServiceStub);
      sinon.assert.calledWith(userServiceStub, userId);
  
      sinon.assert.calledOnce(deleteStub);
      sinon.assert.calledWith(deleteStub, userId, req.user);
  
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
  
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, {
        status: 'success',
        message: 'Delete user data successfully'
      });
    });
  
    it('should handle user not found', async function () {
      userServiceStub.resolves(null);
  
      await userController.deleteUserById(req, res);
  
      sinon.assert.calledOnce(userServiceStub);
      sinon.assert.calledWith(userServiceStub, req.params.id);
  
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 404);
  
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, {
        status: 'failed',
        message: 'User data not found'
      });
    });
  
    // it('should handle delete error and return 500 status', async function () {
    //   const userId = '1';
    //   const userToDelete = {
    //     id: userId,
    //     name: 'John Doe',
    //     email: 'john.doe@example.com'
    //     // Add other user properties based on your implementation
    //   };
  
    //   userServiceStub.resolves(userToDelete);
  
    //   const errorMessage = 'Internal Server Error';
    //   const deleteStub = sinon.stub(userService, 'delete').rejects(new Error(errorMessage));
  
    //   await userController.deleteUserById(req, res);
  
    //   sinon.assert.calledOnce(userServiceStub);
    //   sinon.assert.calledWith(userServiceStub, userId);
  
    //   sinon.assert.calledOnce(deleteStub);
    //   sinon.assert.calledWith(deleteStub, userId, req.user);
  
    //   sinon.assert.calledOnce(res.status);
    //   sinon.assert.calledWith(res.status, 500);
  
    //   sinon.assert.calledOnce(res.json);
    //   sinon.assert.calledWith(res.json, {
    //     status: 'error',
    //     message: errorMessage
    //   });
    // });
  
    it('should handle invalid parameter and return 422 status', async function () {
      req.params.id = 'invalidId';
  
      await userController.deleteUserById(req, res);
  
      sinon.assert.notCalled(userServiceStub);
  
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 422);
  
      sinon.assert.calledOnce(res.json);
      sinon.assert.calledWith(res.json, {
        status: 'failed',
        message: 'Invalid parameter'
      });
    });
  });

  describe('User Controller', function () {
    let req, res, userServiceStub, registerStub, deleteUserStub;
  
    
  beforeEach(function () {
    req = {
      body: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      },
      params: {
        id: '1'
      },
      user: {
        id: 'loggedInUserId',
        role: 'superadmin'
      }
    };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
    userServiceStub = sinon.stub(userService, 'create');
    registerStub = sinon.stub(userController, 'register');
    deleteUserStub = sinon.stub(userController, 'deleteUserById');
  });

  afterEach(function () {
    sinon.restore();
  });

  // describe('registerMember', function () {
  //   it('should call register with role "member"', async function () {
  //     await userController.registerMember(req, res);

  //     sinon.assert.calledOnce(registerStub);
  //     sinon.assert.calledWith(registerStub, req, res, 'member');
  //   });
  // });
  
    // describe('registerAdmin', function () {
    //   it('should call register with role "admin"', async function () {
    //     await userController.registerAdmin(req, res);
  
    //     sinon.assert.calledOnce(registerStub);
    //     sinon.assert.calledWith(registerStub, req, res, 'admin');
    //   });
    // });
  
    // describe('deleteUser', function () {
    //   it('should call deleteUserById with role "superadmin"', async function () {
    //     await userController.deleteUser(req, res);
  
    //     sinon.assert.calledOnce(deleteUserStub);
    //     sinon.assert.calledWith(deleteUserStub, req, res, 'superadmin');
    //   });
    // });
  });

describe('userController2', function () {
    let req, res, userServiceStub;
  
    beforeEach(function () {
      req = {};
      res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy()
      };
      userServiceStub = sinon.stub(userService, 'list');
    });
  
    afterEach(function () {
      sinon.restore();
    });
  
    describe('list', function () {
      it('should return user list successfully', async function () {
        const userData = [
          { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
          { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' }
          // Add other user properties based on your implementation
        ];
  
        userServiceStub.resolves({ data: userData, count: userData.length });
  
        await userController.list(req, res);
  
        sinon.assert.calledOnce(userServiceStub);
  
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 200);
  
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, {
          status: 'success',
          message: 'Get user list successfully',
          data: userData,
          meta: { total: userData.length }
        });
      });
  
      // it('should handle error and return 500 status', async function () {
      //   const errorMessage = 'Internal Server Error';
      //   userServiceStub.rejects(new Error(errorMessage));
  
      //   await userController.list(req, res);
  
      //   sinon.assert.calledOnce(userServiceStub);
  
      //   sinon.assert.calledOnce(res.status);
      //   sinon.assert.calledWith(res.status, 500);
  
      //   sinon.assert.calledOnce(res.json);
      //   sinon.assert.calledWith(res.json, {
      //     status: 'error',
      //     message: errorMessage
      //   });
      // });
    });
  
    describe('listUser', function () {
      it('should return user list successfully', async function () {
        const userData = [
          { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
          { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' }
          // Add other user properties based on your implementation
        ];
  
        userServiceStub.resolves({ data: userData, count: userData.length });
  
        await userController.listUser(req, res);
  
        sinon.assert.calledOnce(userServiceStub);
  
        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 200);
  
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, {
          status: 'success',
          message: 'Get user list successfully',
          data: userData,
          meta: { total: userData.length }
        });
      });
  
      // it('should handle error and return 500 status', async function () {
      //   const errorMessage = 'Internal Server Error';
      //   userServiceStub.rejects(new Error(errorMessage));
  
      //   await userController.listUser(req, res);
  
      //   sinon.assert.calledOnce(userServiceStub);
  
      //   sinon.assert.calledOnce(res.status);
      //   sinon.assert.calledWith(res.status, 500);
  
      //   sinon.assert.calledOnce(res.json);
      //   sinon.assert.calledWith(res.json, {
      //     status: 'error',
      //     message: errorMessage
      //   });
      // });
    });
  });