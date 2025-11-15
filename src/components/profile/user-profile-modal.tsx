"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { useGamificationSettings } from "@/stores/gamification-settings-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/lib/gamification";
import {
  User,
  Calendar,
  MapPin,
  Trophy,
  Star,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  Crown,
  Target,
  Award,
  X,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  CreditCard,
} from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "badges" | "achievements" | "settings"
  >("overview");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<
    "aadhar" | "phone" | "email" | null
  >(null);
  const [verificationData, setVerificationData] = useState({
    aadharNumber: "",
    phoneNumber: "",
    otp: "",
  });
  const [verificationStep, setVerificationStep] = useState<
    "select" | "input" | "verify"
  >("select");
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, logout } = useAuthStore();
  const { userStats, badges, achievements, notifications } =
    useGamificationStore();
  const {
    isEnabled: gamificationEnabled,
    showBadges,
    showProgress,
  } = useGamificationSettings();

  if (!isOpen || !user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleVerificationMethodSelect = (
    method: "aadhar" | "phone" | "email"
  ) => {
    setVerificationMethod(method);
    setVerificationStep("input");
  };

  const handleSendOTP = async () => {
    setIsVerifying(true);
    // TODO: Implement actual OTP sending logic
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationStep("verify");
      alert("OTP sent successfully! (Demo mode)");
    }, 1500);
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    // TODO: Implement actual verification logic with backend
    setTimeout(() => {
      setIsVerifying(false);
      alert("Verification successful! Your account is now verified.");
      setShowVerificationModal(false);
      setVerificationStep("select");
      setVerificationMethod(null);
      // TODO: Update user verification status in auth store
    }, 1500);
  };

  const resetVerification = () => {
    setShowVerificationModal(false);
    setVerificationStep("select");
    setVerificationMethod(null);
    setVerificationData({
      aadharNumber: "",
      phoneNumber: "",
      otp: "",
    });
  };

  const getBadgesByRarity = (rarity: Badge["rarity"]) => {
    return badges.filter((badge) => badge.rarity === rarity);
  };

  const getRarityColor = (rarity: Badge["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 bg-gray-50";
      case "rare":
        return "border-blue-300 bg-blue-50";
      case "epic":
        return "border-purple-300 bg-purple-50";
      case "legendary":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const levelProgress = ((userStats.totalPoints % 300) / 300) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-lg transition-all hover:scale-110 hover:rotate-90 duration-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-xl">
          <div className="flex items-start">
            <div className="flex items-center space-x-4 pr-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  user.name[0]?.toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-primary-100">@{user.username}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span>Level {userStats.level}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="h-4 w-4" />
                    <span>{userStats.totalPoints} points</span>
                  </div>
                  {user.isVerified && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-300 fill-current" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          {[
            { id: "overview", label: "Overview", icon: User },
            ...(gamificationEnabled
              ? [
                  { id: "badges", label: "Badges", icon: Award },
                  { id: "achievements", label: "Achievements", icon: Target },
                ]
              : []),
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Calendar className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.eventsAttended}
                  </div>
                  <div className="text-sm text-gray-600">Events Attended</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Trophy className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.eventsCreated}
                  </div>
                  <div className="text-sm text-gray-600">Events Created</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <MessageCircle className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.messagesPosted}
                  </div>
                  <div className="text-sm text-gray-600">Messages Posted</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.friendsMade}
                  </div>
                  <div className="text-sm text-gray-600">Friends Made</div>
                </div>
              </div>

              {/* Cities Visited */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                  Cities Visited ({userStats.citiesVisited.length})
                </h3>
                {userStats.citiesVisited.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userStats.citiesVisited.map((city) => (
                      <span
                        key={city}
                        className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No cities visited yet. Attend events to start exploring!
                  </p>
                )}
              </div>

              {/* Recent Badges */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary-600" />
                  Recent Badges
                </h3>
                {badges.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {badges.slice(-6).map((badge) => (
                      <div
                        key={badge.id}
                        className={`border-2 rounded-lg p-3 text-center ${getRarityColor(badge.rarity)}`}
                        title={badge.description}
                      >
                        <div className="text-2xl mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium text-gray-700">
                          {badge.name}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No badges earned yet. Start attending events to unlock
                    achievements!
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "badges" && (
            <div className="space-y-6">
              {["legendary", "epic", "rare", "common"].map((rarity) => {
                const rarityBadges = getBadgesByRarity(
                  rarity as Badge["rarity"]
                );
                if (rarityBadges.length === 0) return null;

                return (
                  <div key={rarity}>
                    <h3 className="font-medium text-gray-900 mb-3 capitalize">
                      {rarity} Badges ({rarityBadges.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {rarityBadges.map((badge) => (
                        <div
                          key={badge.id}
                          className={`border-2 rounded-lg p-4 ${getRarityColor(badge.rarity)}`}
                        >
                          <div className="text-3xl mb-2 text-center">
                            {badge.icon}
                          </div>
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {badge.name}
                          </div>
                          <div className="text-xs text-gray-600 mb-2">
                            {badge.description}
                          </div>
                          {badge.unlockedAt && (
                            <div className="text-xs text-gray-500">
                              Unlocked{" "}
                              {new Date(badge.unlockedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {badges.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Badges Yet
                  </h3>
                  <p className="text-gray-500">
                    Start attending events and engaging with the community to
                    earn badges!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Verification Section */}
              {!user.isVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-900 mb-1">
                        Verify Your Account
                      </h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Verified organizers are trusted by the community and can
                        create featured events. Get your verification badge now!
                      </p>
                      <Button
                        onClick={() => setShowVerificationModal(true)}
                        className="bg-yellow-600 hover:bg-yellow-700"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Get Verified
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {user.isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-900">
                        Account Verified
                      </h4>
                      <p className="text-sm text-green-700">
                        Your account is verified. You can create featured
                        events!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  Account Settings
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Notification Preferences
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Verification Modal */}
        {showVerificationModal && (
          <div
            className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={resetVerification}
          >
            <div
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Verify Your Account
                </h3>
                <button
                  onClick={resetVerification}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {verificationStep === "select" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-4">
                    Choose a verification method to get your verified badge
                  </p>

                  <button
                    onClick={() => handleVerificationMethodSelect("aadhar")}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Aadhar Card
                        </div>
                        <div className="text-sm text-gray-600">
                          Verify using your Aadhar number
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleVerificationMethodSelect("phone")}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Phone className="h-6 w-6 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Phone Number
                        </div>
                        <div className="text-sm text-gray-600">
                          Verify using OTP to your phone
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleVerificationMethodSelect("email")}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Mail className="h-6 w-6 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Gmail</div>
                        <div className="text-sm text-gray-600">
                          Verify using your Gmail account
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {verificationStep === "input" && (
                <div className="space-y-4">
                  {verificationMethod === "aadhar" && (
                    <>
                      <p className="text-sm text-gray-600">
                        Enter your 12-digit Aadhar number
                      </p>
                      <input
                        type="text"
                        placeholder="XXXX XXXX XXXX"
                        maxLength={12}
                        value={verificationData.aadharNumber}
                        onChange={(e) =>
                          setVerificationData({
                            ...verificationData,
                            aadharNumber: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </>
                  )}

                  {verificationMethod === "phone" && (
                    <>
                      <p className="text-sm text-gray-600">
                        Enter your phone number to receive OTP
                      </p>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        maxLength={10}
                        value={verificationData.phoneNumber}
                        onChange={(e) =>
                          setVerificationData({
                            ...verificationData,
                            phoneNumber: e.target.value.replace(/\D/g, ""),
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </>
                  )}

                  {verificationMethod === "email" && (
                    <>
                      <p className="text-sm text-gray-600">
                        Click below to verify with your Gmail account
                      </p>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {user.email}
                      </div>
                    </>
                  )}

                  <div className="flex space-x-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setVerificationStep("select")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSendOTP}
                      disabled={
                        isVerifying ||
                        (verificationMethod === "aadhar" &&
                          verificationData.aadharNumber.length !== 12) ||
                        (verificationMethod === "phone" &&
                          verificationData.phoneNumber.length !== 10)
                      }
                      className="flex-1"
                    >
                      {isVerifying ? "Sending..." : "Send OTP"}
                    </Button>
                  </div>
                </div>
              )}

              {verificationStep === "verify" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Enter the OTP sent to your{" "}
                    {verificationMethod === "aadhar"
                      ? "registered mobile number"
                      : verificationMethod === "phone"
                        ? "phone"
                        : "email"}
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={verificationData.otp}
                    onChange={(e) =>
                      setVerificationData({
                        ...verificationData,
                        otp: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg tracking-widest"
                  />

                  <div className="flex space-x-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setVerificationStep("input")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerify}
                      disabled={
                        isVerifying || verificationData.otp.length !== 6
                      }
                      className="flex-1"
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </Button>
                  </div>

                  <button
                    onClick={handleSendOTP}
                    className="text-sm text-primary-600 hover:text-primary-700 w-full text-center"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
