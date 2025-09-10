/**
 * Tournament Model - MongoDB Schema Definition
 * 
 * This file contains the commented-out Mongoose schema for tournaments.
 * This would be used in a production environment with MongoDB.
 */

/*
const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    minlength: [3, 'Tournament name must be at least 3 characters'],
    maxlength: [200, 'Tournament name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Tournament date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Tournament date must be in the future'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['upcoming', 'active', 'completed'],
      message: 'Status must be upcoming, active, or completed'
    },
    default: 'upcoming'
  },
  location: {
    type: String,
    trim: true,
    maxlength: [300, 'Location cannot exceed 300 characters']
  },
  organizer: {
    type: String,
    trim: true,
    maxlength: [100, 'Organizer name cannot exceed 100 characters']
  },
  registration_deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return value < this.date;
      },
      message: 'Registration deadline must be before tournament date'
    }
  },
  max_participants: {
    type: Number,
    min: [1, 'Maximum participants must be at least 1'],
    max: [10000, 'Maximum participants cannot exceed 10,000']
  },
  prize_structure: {
    type: String,
    trim: true,
    maxlength: [1000, 'Prize structure cannot exceed 1000 characters']
  },
  rules: {
    type: String,
    trim: true,
    maxlength: [5000, 'Rules cannot exceed 5000 characters']
  },
  entry_fee: {
    type: Number,
    min: [0, 'Entry fee cannot be negative'],
    default: 0
  },
  contact_info: {
    type: String,
    trim: true,
    maxlength: [500, 'Contact info cannot exceed 500 characters']
  },
  categories: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    age_group: {
      type: String,
      enum: ['Cadet (12-13)', 'Youth (14-15)', 'Junior (16-17)', 'Senior (18+)']
    },
    weight_divisions: [{
      name: String,
      min_weight: Number,
      max_weight: Number
    }],
    belt_requirements: [String]
  }],
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Indexes for better query performance
tournamentSchema.index({ date: 1 });
tournamentSchema.index({ status: 1 });
tournamentSchema.index({ name: 'text', description: 'text', location: 'text' });
tournamentSchema.index({ organizer: 1 });
tournamentSchema.index({ created_by: 1 });

// Virtual for participant count (would be populated via aggregation)
tournamentSchema.virtual('participant_count', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'tournament_id',
  count: true,
  match: { status: { $ne: 'cancelled' } }
});

// Ensure virtual fields are serialized
tournamentSchema.set('toJSON', { virtuals: true });
tournamentSchema.set('toObject', { virtuals: true });

// Pre-save middleware to update status based on date
tournamentSchema.pre('save', function(next) {
  const now = new Date();
  const tournamentDate = new Date(this.date);
  
  if (tournamentDate < now && this.status === 'upcoming') {
    this.status = 'active';
  }
  
  next();
});

// Static method to get tournaments with participant counts
tournamentSchema.statics.findWithParticipantCounts = function(query = {}) {
  return this.aggregate([
    { $match: query },
    {
      $lookup: {
        from: 'participants',
        localField: '_id',
        foreignField: 'tournament_id',
        as: 'participants'
      }
    },
    {
      $addFields: {
        participant_count: {
          $size: {
            $filter: {
              input: '$participants',
              cond: { $ne: ['$$this.status', 'cancelled'] }
            }
          }
        }
      }
    },
    { $project: { participants: 0 } }, // Remove participants array from output
    { $sort: { date: 1 } }
  ]);
};

module.exports = mongoose.model('Tournament', tournamentSchema);
*/