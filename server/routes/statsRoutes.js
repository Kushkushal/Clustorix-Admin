const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect } = require('../middleware/auth'); // Changed from verifyToken to protect

// Get MongoDB storage stats
router.get('/db-stats', protect, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    
    // MongoDB Atlas free tier is 512MB
    const maxStorageBytes = 512 * 1024 * 1024; // 512MB in bytes
    
    const storageStats = {
      dataSize: stats.dataSize, // Actual data size
      storageSize: stats.storageSize, // Storage allocated
      indexSize: stats.indexSize, // Index size
      totalSize: stats.dataSize + stats.indexSize, // Total used
      maxStorage: maxStorageBytes,
      collections: stats.collections,
      objects: stats.objects,
      avgObjSize: stats.avgObjSize,
      // Calculated percentages
      usedPercentage: ((stats.dataSize + stats.indexSize) / maxStorageBytes * 100).toFixed(2),
      freePercentage: (((maxStorageBytes - (stats.dataSize + stats.indexSize)) / maxStorageBytes) * 100).toFixed(2),
    };
    
    res.json({
      success: true,
      data: storageStats
    });
  } catch (error) {
    console.error('Error fetching DB stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch database statistics',
      error: error.message
    });
  }
});

module.exports = router;