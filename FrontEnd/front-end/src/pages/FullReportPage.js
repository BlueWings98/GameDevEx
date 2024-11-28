import React, { useEffect } from "react";
import initializeGame from "../config/initializeGame";

const FullReportPage = () => {
  useEffect(() => {
    const game = initializeGame();
    game.scene.start("FullReport");
  }, []);
  return <div id="phaser-container" />;
};
export default FullReportPage;