/**
 * Participant Model - MongoDB Schema Definition
 * 
 * This file contains the commented-out Mongoose schema for tournament participants.
 * This would be used in a production environment with MongoDB.
 */

/*
const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Participant name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    match: [/^[a-zA-Z\s.'-]+$/, 'Name can only contain letters, spaces, periods, apostrophes, and hyphens']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  skb_id: {
    type: String,
    required: [true, 'SKB ID is required'],
    trim: true,
    uppercase: true,
    minlength: [3, 'SKB ID must be at least 3 characters'],
    maxlength: [20, 'SKB ID cannot exceed 20 characters'],
    match: [/^[A-Z0-9]+$/, 'SKB ID can only contain uppercase letters and numbers']
  },
  tournament_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: [true, 'Tournament ID is required']
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['registered', 'confirmed', 'cancelled'],
      message: 'Status must be registered, confirmed, or cancelled'
    },
    default: 'registered'
  },
  belt_level: {
    type: String,
    enum: [
      'White', 'Yellow', 'Orange', 'Green', 'Blue', 'Brown',
      'Black Belt (1st Dan)', 'Black Belt (2nd Dan)', 'Black Belt (3rd Dan)',
      'Black Belt (4th Dan)', 'Black Belt (5th Dan)', 'Black Belt (6th Dan)',
      'Black Belt (7th Dan)', 'Black Belt (8th Dan)', 'Black Belt (9th Dan)',
      'Black Belt (10th Dan)'
    ]
  },
  age_category: {
    type: String,
    enum: ['Cadet (12-13)', 'Youth (14-15)', 'Junior (16-17)', 'Senior (18+)']
  },
  weight_category: {
    type: String,
    enum: [
      'Bantamweight', 'Featherweight', 'Lightweight', 'Welterweight',
      'Middleweight', 'Light Heavyweight', 'Heavyweight', 'Super Heavyweight'
    ]
  },
  date_of_birth: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        const age = Math.floor((new Date() - value) / (365.25 * 24 * 60 * 60 * 1000));
        return age >= 5 && age <= 100;
      },
      message: 'Age must be between 5 and 100 years'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  emergency_contact: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid emergency contact phone number']
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [50, 'Relationship cannot exceed 50 characters']
    }
  },
  medical_conditions: {
    type: String,
    trim: true,
    maxlength: [500, 'Medical conditions cannot exceed 500 characters']
  },
  dietary_requirements: {
    type: String,
    trim: true,
    maxlength: [200, 'Dietary requirements cannot exceed 200 characters']
  },
  previous_tournaments: [{
    name: String,
    date: Date,
    placement: String,
    category: String
  }],
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  payment_reference: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  registered_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Admin who registered the participant (if done via admin panel)
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Compound indexes for better query performance
participantSchema.index({ tournament_id: 1, status: 1 });
participantSchema.index({ tournament_id: 1, email: 1 }, { unique: true });
participantSchema.index({ tournament_id: 1, skb_id: 1 }, { unique: true });
participantSchema.index({ email: 1 });
participantSchema.index({ skb_id: 1 });
participantSchema.index({ registration_date: -1 });
participantSchema.index({ belt_level: 1 });
participantSchema.index({ age_category: 1 });
participantSchema.index({ weight_category: 1 });

// Text index for search functionality
participantSchema.index({ 
  name: 'text', 
  email: 'text', 
  skb_id: 'text' 
});

// Virtual for age calculation
participantSchema.virtual('age').get(function() {
  if (!this.date_of_birth) return null;
  return Math.floor((new Date() - this.date_of_birth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Ensure virtual fields are serialized
participantSchema.set('toJSON', { virtuals: true });
participantSchema.set('toObject', { virtuals: true });

// Pre-save middleware for data validation and processing
participantSchema.pre('save', async function(next) {
  // Ensure SKB ID is uppercase
  if (this.skb_id) {
    this.skb_id = this.skb_id.toUpperCase();
  }
  
  // Auto-determine age category based on date of birth
  if (this.date_of_birth && !this.age_category) {
    const age = Math.floor((new Date() - this.date_of_birth) / (365.25 * 24 * 60 * 60 * 1000));
    
    if (age >= 12 && age <= 13) {
      this.age_category = 'Cadet (12-13)';
    } else if (age >= 14 && age <= 15) {
      this.age_category = 'Youth (14-15)';
    } else if (age >= 16 && age <= 17) {
      this.age_category = 'Junior (16-17)';
    } else if (age >= 18) {
      this.age_category = 'Senior (18+)';
    }
  }
  
  next();
});

// Static method to get participants with tournament details
participantSchema.statics.findWithTournamentDetails = function(query = {}) {
  return this.find(query)
    .populate('tournament_id', 'name date location status')
    .populate('registered_by', 'username')
    .sort({ registration_date: -1 });
};

// Static method to get participant statistics for a tournament
participantSchema.statics.getTournamentStats = function(tournamentId) {
  return this.aggregate([
    { $match: { tournament_id: mongoose.Types.ObjectId(tournamentId) } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        registered: { $sum: { $cond: [{ $eq: ['$status', 'registered'] }, 1, 0] } },
        confirmed: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        belt_levels: { $push: '$belt_level' },
        age_categories: { $push: '$age_category' },
        weight_categories: { $push: '$weight_category' }
      }
    }
  ]);
};

module.exports = mongoose.model('Participant', participantSchema);
*/