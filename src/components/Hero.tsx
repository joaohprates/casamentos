import { Box, Typography, Button } from "@mui/material";
const video = "https://res.cloudinary.com/dlf3r15qa/video/upload/v1773960348/viideo_tagvjx.mp4";

function Hero() {
  return (
    <Box sx={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      

      <div className="video-overlay" />

    </Box>
  );
}

export default Hero;