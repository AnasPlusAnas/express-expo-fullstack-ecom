import { Request, Response } from 'express';
import { db } from '../../db/index.js';
import { usersTable } from '../../db/schema/users.js';
import { eq } from 'drizzle-orm';
import * as becrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response) => {
  try {
    const data = req.cleanBody;
    data.password = await becrypt.hash(data.password, 10);

    const [user] = await db.insert(usersTable).values(data).returning();
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
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
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const data = req.cleanBody;
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, data.email));

    if (!user) {
      res.status(401).json({
        message: 'Authentication failed',
      });
      return;
    }

    const matchPass = await becrypt.compare(data.password, user.password);

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
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
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
};
