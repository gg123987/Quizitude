import {
  getUserById,
  insertUser,
  updateUser,
  deleteUser,
  updateUserStreak,
  checkUserStreak,
} from "@/services/userService";
import { vi, describe, it, expect, beforeEach } from "vitest";

describe("User Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch a user by ID", async () => {
    const userId = 1;
    const result = await getUserById(userId);
    expect(result).toEqual({ id: 1, name: "Test User" });
    expect(vi.mocked(getUserById).mock.calls[0][0]).toBe(userId); // Ensure the correct user ID was passed
  });

  it("should insert a new user", async () => {
    const newUser = { name: "New User" };
    const result = await insertUser(newUser);
    expect(result).toEqual([{ id: 1, name: "New User" }]);
    expect(vi.mocked(insertUser).mock.calls[0][0]).toEqual(newUser); // Ensure the correct user data was passed
  });

  it("should update a user", async () => {
    const userId = 1;
    const userUpdates = { name: "Updated User" };
    const result = await updateUser(userId, userUpdates);
    expect(result).toEqual([{ id: 1, name: "Updated User" }]);
    expect(vi.mocked(updateUser).mock.calls[0]).toEqual([userId, userUpdates]); // Ensure correct arguments were passed
  });

  it("should delete a user", async () => {
    const userId = 1;
    const result = await deleteUser(userId);
    expect(result).toEqual({ data: [{ id: 1 }], error: null });
    expect(vi.mocked(deleteUser).mock.calls[0][0]).toBe(userId); // Ensure the correct user ID was passed
  });

  it("should update user streak", async () => {
    const userId = 1;
    const currentDate = new Date();
    await updateUserStreak(userId, currentDate);
    expect(vi.mocked(updateUserStreak).mock.calls[0]).toEqual([
      userId,
      currentDate,
    ]); // Ensure correct arguments were passed
  });

  it("should check and reset user streak", async () => {
    const userId = 1;
    const currentStreak = await checkUserStreak(userId);
    expect(currentStreak).toBe(0);
    expect(vi.mocked(checkUserStreak).mock.calls[0][0]).toBe(userId); // Ensure the correct user ID was passed
  });
});
