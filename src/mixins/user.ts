import BaseAPIHandler from "@handlers/baseApiHandler";

export interface DelUserParams {
  User: {
    userName: string;
  };
}

// Response interfaces
interface UserResponse {
  value: {
    rspCode: number;
    [key: string]: any;
  };
}

interface OnlineUsersResponse {
  [key: string]: any;
}

interface UsersListResponse {
  [key: string]: any;
}

class UserAPIMixin extends BaseAPIHandler {
  /**
   * Return a list of current logged-in users in json format
   * See examples/response/GetOnline.json for example response data.
   */
  async getOnlineUser(): Promise<OnlineUsersResponse> {
    const body = [{ cmd: "GetOnline", action: 1, param: {} }];
    return this.executeCommand("GetOnline", body);
  }

  /**
   * Return a list of user accounts from the camera in json format.
   * See examples/response/GetUser.json for example response data.
   */
  async getUsers(): Promise<UsersListResponse> {
    const body = [{ cmd: "GetUser", action: 1, param: {} }];
    return this.executeCommand("GetUser", body);
  }

  /**
   * Add a new user account to the camera
   * @param username - The user's username
   * @param password - The user's password
   * @param level - The privilege level 'guest' or 'admin'. Default is 'guest'
   * @returns whether the user was added successfully
   */
  async addUser(
    username: string,
    password: string,
    level: "guest" | "admin" = "guest",
  ): Promise<boolean> {
    const body = [
      {
        cmd: "AddUser",
        action: 0,
        param: {
          User: {
            userName: username,
            password: password,
            level: level,
          },
        },
      },
    ];

    try {
      const response = await this.executeCommand("AddUser", body);
      const rData = response[0] as UserResponse;

      if (rData.value.rspCode === 200) {
        return true;
      }
      console.log("Could not add user. Camera responded with:", rData.value);
      return false;
    } catch (error) {
      console.error("Error adding user:", error);
      return false;
    }
  }

  /**
   * Modify the user's password by specifying their username
   * @param username - The user which would want to be modified
   * @param password - The new password
   * @returns whether the user was modified successfully
   */
  async modifyUser(username: string, password: string): Promise<boolean> {
    const body = [
      {
        cmd: "ModifyUser",
        action: 0,
        param: {
          User: {
            userName: username,
            password: password,
          },
        },
      },
    ];

    try {
      const response = await this.executeCommand("ModifyUser", body);
      const rData = response[0] as UserResponse;

      if (rData.value.rspCode === 200) {
        return true;
      }
      console.log(
        `Could not modify user: ${username}\nCamera responded with: ${rData.value}`,
      );
      return false;
    } catch (error) {
      console.error("Error modifying user:", error);
      return false;
    }
  }

  /**
   * Delete a user by specifying their username
   * @param username - The user which would want to be deleted
   * @returns whether the user was deleted successfully
   */
  async deleteUser(username: string): Promise<boolean> {
    const body = [
      {
        cmd: "DelUser",
        action: 0,
        param: {
          User: {
            userName: username,
          },
        },
      },
    ];

    try {
      const response = await this.executeCommand("DelUser", body);
      const rData = response[0] as UserResponse;

      if (rData.value.rspCode === 200) {
        return true;
      }
      console.log(
        `Could not delete user: ${username}\nCamera responded with: ${rData.value}`,
      );
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}

export default UserAPIMixin;
