import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { usersTable } from '../../db/schema/users.js';
import { eq } from 'drizzle-orm';
import * as becrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { id, role, ...userData } = req.body;
    userData.password = await becrypt.hash(userData.password, 10);

    const [user] = await db.insert(usersTable).values(userData).returning();
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User created successfully!',
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      errors: [
        {
          type: 'server',
          value: null,
          msg: error || 'Failed to create product',
          path: 'server',
          location: 'internal',
        },
      ],
    });
  }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    // only pick email and password from the request body
    let { email, password } = req.body;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      res.status(401).json({
        message: 'Authentication failed',
      });
      return;
    }

    const matchPass = await becrypt.compare(password, user.password);

    if (!matchPass) {
      res.status(401).json({
        message: 'Authentication failed',
      });
      return;
    }

    // create a jwt token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '30d',
      }
    );

    // omit password from the user object
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      errors: [
        {
          type: 'server',
          value: null,
          msg: error || 'Failed to create product',
          path: 'server',
          location: 'internal',
        },
      ],
    });
  }
}
