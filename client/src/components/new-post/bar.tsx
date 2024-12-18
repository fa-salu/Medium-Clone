import { Notifications } from "@mui/icons-material";
import { Avatar, Button, IconButton } from "@mui/material";
import React from "react";

export default function Bar() {
  return (
    <div className="flex justify-between items-center px-52 py-4 bg-white rounded-lg">
      <div className="flex items-end">
        <h1 className="text-3xl font-semibold">Medium</h1>
        <p className="text-sm ml-3 text-gray-500">Draft in Fasalu</p>
      </div>
      <div className="flex items-center space-x-6">
        <Button
          variant="contained"
          color="success"
          className="text-sm py-2 px-4 rounded-md"
        >
          Publish
        </Button>
        <IconButton className="p-2 hover:bg-gray-200 rounded-full">
          <Notifications />
        </IconButton>
        <IconButton className="p-2 hover:bg-gray-200 rounded-full">
          <Avatar
            alt="Remy Sharp"
            src="https://img.freepik.com/premium-vector/avatar-icon0002_750950-43.jpg?ga=GA1.1.478860807.1733286450&semt=ais_hybrid"
          />
        </IconButton>
      </div>
    </div>
  );
}
