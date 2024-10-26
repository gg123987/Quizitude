import useAuth from "@/hooks/useAuth";
import { useOutletContext } from "react-router-dom";
import useStreak from "@/hooks/useStreak";
import flame from "@/assets/flame.png";
import MonthIndicator from "@/components/features/Streaks/MonthIndicator";
import "./streak.css";

const Streak = () => {
  const { userId } = useOutletContext();
  const { userDetails } = useAuth();
  const streakCount = useStreak(userId);

  const checkStudyToday = () => {
    const today = new Date();
    const lastSession = userDetails.last_session
      ? new Date(userDetails.last_session)
      : null;
    if (lastSession) {
      const lastSessionDate = new Date(
        lastSession.getFullYear(),
        lastSession.getMonth(),
        lastSession.getDate()
      );
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      return lastSessionDate.getTime() === todayDate.getTime();
    }
    return false;
  };

  return (
    <div className="streak-container">
      <section className="month-streak-section">
        <div className="month-streak-box">
          <div className="streak-col left">
            <div className="streak-graphic">
              <img src={flame} alt="Streak" />
              <div className="streak-count-group">
                <h4 className="streak-count">{streakCount}</h4>
                <h2 className="streak-day">Day Streak</h2>
              </div>
            </div>
          </div>
          <div className="month-streak-sep" />
          <div className="streak-col right">
            <div className="streak-info">
              <MonthIndicator
                streakCount={streakCount}
                studiedToday={checkStudyToday()}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Streak;
