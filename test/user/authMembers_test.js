// const sinon = require('sinon');
// const authController = require('../../app/controllers/api/v1/authController');

// describe('authController3', function () {
//   describe('authorizeMembers', function () {
//     it('harus memanggil authorize dengan peran yang benar untuk member', async function () {
//       const req = {};
//       const res = {};
//       const next = sinon.spy();

//       const authorizeMemberStub = sinon.stub(authController, 'authorizeMember');
//       console.log(authorizeMemberStub)

//       await authController.authorizeMember(req, res, next);

//       // Tunggu panggilan assertion untuk memastikan bahwa mereka dieksekusi setelah operasi asinkron selesai
//       sinon.assert.calledWith(authorizeMemberStub, req, res, next);
//       sinon.assert.calledOnce(authorizeMemberStub);

//       authorizeMemberStub.restore();
//     });
//   });

//   describe('authorizeAdmins', function () {
//     it('harus memanggil authorize dengan peran yang benar untuk admin', async function () {
//       const req = {};
//       const res = {};
//       const next = sinon.spy();

//       const authorizeAdminStub = sinon.stub(authController, 'authorizeAdmin');

//       await authController.authorizeAdmin(req, res, next);

//       // Tunggu panggilan assertion untuk memastikan bahwa mereka dieksekusi setelah operasi asinkron selesai
//       sinon.assert.calledWith(authorizeAdminStub, req, res, next);
//       sinon.assert.calledOnce(authorizeAdminStub);

//       authorizeAdminStub.restore();
//     });
//   });

//   describe('authorizeSupers', function () {
//     it('harus memanggil authorize dengan peran yang benar untuk superadmin', async function () {
//       const req = {};
//       const res = {};
//       const next = sinon.spy();

//       const authorizeSuperStub = sinon.stub(authController, 'authorizeSuper');

//       await authController.authorizeSuper(req, res, next);

//       // Tunggu panggilan assertion untuk memastikan bahwa mereka dieksekusi setelah operasi asinkron selesai
//       sinon.assert.calledWith(authorizeSuperStub, req, res, next);
//       sinon.assert.calledOnce(authorizeSuperStub);

//       authorizeSuperStub.restore();
//     });
//   });
// });

// const sinon = require('sinon');
// const { assert } = require('chai');
// const authController = require('../../app/controllers/api/v1/authController');
// const userService = require('../../app/services/userService');

// describe('authController', function () {
//   let req, res, next, userServiceStub;
//   beforeEach(function () {
//     req = {};
//     res = {};
//     next = sinon.spy();
//     userServiceStub = sinon.stub(userService, 'get');
//   });

//   afterEach(function () {
//     sinon.restore();
//   });

//   describe('authorizeMember', function () {
//     it('should call authorize with correct roles for member', async function () {
//       const user = { id: 'userId', role: 'member' };
//       userServiceStub.withArgs('userId').resolves(user);

//       const authorizeStub = sinon.stub(authController, 'authorize');
//       await authController.authorizeMember(req, res, next);

//       sinon.assert.calledWith(authorizeStub, req, res, next, ['member', 'admin', 'superadmin']);
//       sinon.assert.calledOnce(authorizeStub);
//       sinon.assert.calledWith(userServiceStub, 'userId');
//     });
//   });

//   describe('authorizeAdmin', function () {
//     it('should call authorize with correct roles for admin', async function () {
//       const user = { id: 'userId', role: 'admin' };
//       userServiceStub.withArgs('userId').resolves(user);

//       const authorizeStub = sinon.stub(authController, 'authorize');
//       await authController.authorizeAdmin(req, res, next);

//       sinon.assert.calledWith(authorizeStub, req, res, next, ['admin', 'superadmin']);
//       sinon.assert.calledOnce(authorizeStub);
//       sinon.assert.calledWith(userServiceStub, 'userId');
//     });
//   });

//   describe('authorizeSuper', function () {
//     it('should call authorize with correct roles for superadmin', async function () {
//       const user = { id: 'userId', role: 'superadmin' };
//       userServiceStub.withArgs('userId').resolves(user);

//       const authorizeStub = sinon.stub(authController, 'authorize');
//       await authController.authorizeSuper(req, res, next);

//       sinon.assert.calledWith(authorizeStub, req, res, next, ['superadmin']);
//       sinon.assert.calledOnce(authorizeStub);
//       sinon.assert.calledWith(userServiceStub, 'userId');
//     });
//   });
// });
