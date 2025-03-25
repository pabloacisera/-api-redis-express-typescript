/**
 * @swagger
 * components:
 *   schemas:
 *     FakeData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 1
 *         name:
 *           type: string
 *           example: "John Doe"
 *         direccion:
 *           type: string
 *           description: User's address
 *           example: "123 Main Street"
 *         nacimiento:
 *           type: string
 *           format: date
 *           description: Date of birth (YYYY-MM-DD)
 *           example: "1990-01-01"
 *       required:
 *         - id
 *         - name
 */
export interface IResponse {
  id: number;
  name: string;
  direccion: string;
  nacimiento: string;
}
