import { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { darkTheme, lightTheme } from '@/theme';
import ThemeToggle from '@/components/ThemeToggle';
import FavoriteButton from '@/components/FavoriteButton';
import SortButton from '@/components/SortButton';
import HomePage from '@/pages/HomePage';
import FolderDetailPage from '@/pages/FolderDetailPage';
import Favorite from '@/pages/Favorite';
import SortPage from '@/pages/SortPage';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <div data-testid="app">
          <ThemeToggle onToggle={handleThemeToggle} />
          <FavoriteButton />
          <SortButton />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/folder/:folderName" element={<FolderDetailPage />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/sort" element={<SortPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
