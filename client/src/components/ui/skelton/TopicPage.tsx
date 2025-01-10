import React from "react";
import { Box, Skeleton } from "@mui/material";

export default function TopicsSkeleton() {
  return (
    <Box py={6} display="flex" flexDirection="column" alignItems="center">
      <Box mt={4} width="100%" maxWidth="600px">
        {[1, 2, 3, 4, 5].map((item) => (
          <Box
            key={item}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            borderBottom="1px solid #e0e0e0"
          >
            <Box display="flex" alignItems="center" gap={2} flex="1" mr={22}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width={60} height={30} />
            </Box>

            <Box>
              <Skeleton
                variant="rectangular"
                width={60}
                height={30}
                sx={{ borderRadius: "16px" }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
