import { 
    validateData, 
    validateToken ,
    ecrypt, 
    createToken
} from '../../utils'; 

jest.mock('../../utils', () => ({
    validateData: jest.fn(() => Promise.resolve(true)),
    validateToken: jest.fn(() => Promise.resolve({ valid: true, payload: 'any_payload' })),
    ecrypt: jest.fn(() => Promise.resolve('any_hash')),
    createToken: jest.fn(() => Promise.resolve('any_token'))
})); 

import { Db } from '../../services/database';
import { AuthController } from '../../controllers';
 
const mockCreateRequest = {
    body: {
        "email": "test@teste.com", 
        "password": "123456",
        "name": "any_name"
    }
} 

const mockLoginRequest = {
    body: {
        "email": "test@teste.com", 
        "password": "123456",
    }
}

const mockLogoutRequest = {
    body: {
        "refresh_token": "any_token", 
    }
}
const mockRefreshRequest = {
    body: {
        "refresh_token": "any_token", 
    }
}

describe('AuthController', () => {
    const db = new Db(); 
    beforeAll(async () => {
        await db.init(); 
    })

    afterAll(async () => {
       await db.close(); 
    })

    afterEach(async () => {
        await db.dropCollection('users')
        await db.dropCollection('session')
    })

    describe('Create', () => {
        it('should call encript with the right parametes', async () => {
            await AuthController.create(mockCreateRequest); 
            expect(ecrypt).toHaveBeenCalledWith(mockCreateRequest.body.password)
        })

        it('Should return 500 if encrypt returns an error', async () => {
            ecrypt.mockImplementationOnce(async () => Promise.reject(new Error()))
            const response = await AuthController.create(mockCreateRequest); 
            expect(response.statusCode).toBe(500)
        })

        it('Should return 500 if createToken returns an error', async () => {
            createToken.mockImplementationOnce(async () => Promise.reject(new Error()))
            const response = await AuthController.create(mockCreateRequest); 
            expect(response.statusCode).toBe(500)
        })

        it('Should return 400 if an email has already been used', async () => {
            await AuthController.create(mockCreateRequest); 
            const response = await AuthController.create(mockCreateRequest); 
            expect(response.statusCode).toBe(400)
        })
        
        it('Should return 200  ', async () => {
            const response = await AuthController.create(mockCreateRequest); 
            expect(response.statusCode).toBe(200)
        })
    })

    describe('Login', () => {
        beforeEach(async () => {
            await AuthController.create(mockCreateRequest); 
        })
        
        it('should call validadeData with the right parametes', async () => {
            await AuthController.login(mockLoginRequest); 
            expect(validateData).toHaveBeenCalledWith(mockCreateRequest.body.password, 'any_hash')
        })

  
        it('Should return 500 if validadeData returns an error', async () => {
            validateData.mockImplementationOnce(async () => Promise.reject(new Error()))
            const response = await AuthController.login(mockLoginRequest); 
            expect(response.statusCode).toBe(500)
        })

        it('Should return 500 if createToken returns an error', async () => {
            createToken.mockImplementationOnce(async () => Promise.reject(new Error()))
            const response = await AuthController.login(mockLoginRequest); 
            expect(response.statusCode).toBe(500)
        })

        it('Should return 400 if an email does not exist', async () => {
            const fakeRequestWithInvalidEmail = {
                body: {
                    "email": "invalid@teste.com", 
                    "password": "123456",
                }
            } 
            const response = await AuthController.login(fakeRequestWithInvalidEmail); 
            expect(response.statusCode).toBe(400)
        })
        
        it('Should return 200', async () => {
            const response = await AuthController.login(mockLoginRequest); 
            expect(response.statusCode).toBe(200)
        })

    })

    describe('Logout', () => {
        beforeEach(async () => {
            await AuthController.create(mockCreateRequest); 
        })
        it('Should return 400 if no session is found', async () => {
            const mockInvalidLogoutRequest = {
                body: {
                    "refresh_token": "invalid_token", 
                }
            }
            const response = await AuthController.logout(mockInvalidLogoutRequest); 
            expect(response.statusCode).toBe(400);
        })

        it('Should logout', async () => {
            const response = await AuthController.logout(mockLogoutRequest); 
            expect(response.statusCode).toBe(204);
        })
    })

    describe('Refresh', () => {
        beforeEach(async () => {
            await AuthController.create(mockCreateRequest); 
        })
        
        it('Should return 400 token is invalid', async () => {
            validateToken.mockImplementationOnce(() => Promise.resolve({ valid: false, payload: 'any_payload' }))
            const response = await AuthController.refresh(mockRefreshRequest); 
            expect(response.statusCode).toBe(400)
        })

        it('Should return 400 session is invalid', async () => {
            const mockInvalidRefreshRequest = {
                body: {
                    "refresh_token": "invalid_token", 
                }
            }            
            const response = await AuthController.refresh(mockInvalidRefreshRequest); 
            expect(response.statusCode).toBe(400)
        })

        it('Should return 500 if validateToken returns an error', async () => {
            validateToken.mockImplementationOnce(() => Promise.reject(new Error()))
            const response = await AuthController.refresh(mockRefreshRequest); 
            expect(response.statusCode).toBe(500)
        })
        it('Should return 500 if createToken returns an error', async () => {
            createToken.mockImplementationOnce(() => Promise.reject(new Error()))
            const response = await AuthController.refresh(mockRefreshRequest); 
            expect(response.statusCode).toBe(500)
        })

        it('Should call create token with the right parameters', async () => {         
            await AuthController.refresh(mockRefreshRequest); 
            expect(createToken).toBeCalledWith('any_payload')
        })

        it('Should create an refresh token', async () => {         
            const request = await AuthController.refresh(mockRefreshRequest); 
            expect(request.statusCode).toBe(200)
        })
    })
})