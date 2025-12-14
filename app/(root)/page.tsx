import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import BackgroundAnimation from "@/components/BackgroundAnimation";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";

export default async function Home() {
  const user: User | null = await getCurrentUser();
  if (!user) {
    return (
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-2xl font-semibold">Welcome to PrepWise</h2>
          <p className="text-sm text-gray-500">
            Sign in to start practicing interviews and get feedback from AI.
          </p>

          <div className="flex gap-3">
            <Button asChild className="btn-primary">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="btn-ghost">
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
    );
  }

  const userInterviews = user?.id ? await getInterviewsByUserId(user.id) : null;

  const allInterviews = user?.id
    ? await getLatestInterviews({ userId: user.id })
    : null;

  // Filter taken interviews (user's interviews that have feedback)
  const takenInterviews = userInterviews
    ? await Promise.all(
        userInterviews.map(async (interview) => {
          const feedback = await getFeedbackByInterviewId({
            interviewId: interview.id,
            userId: user.id,
          });
          return feedback ? interview : null;
        })
      ).then((results) => results.filter(Boolean))
    : [];

  // Filter available interviews (user's interviews without feedback + other users' interviews)
  const userInterviewsWithoutFeedback = userInterviews
    ? await Promise.all(
        userInterviews.map(async (interview) => {
          const feedback = await getFeedbackByInterviewId({
            interviewId: interview.id,
            userId: user.id,
          });
          return !feedback ? interview : null;
        })
      ).then((results) => results.filter(Boolean))
    : [];

  const availableInterviews = [
    ...(userInterviewsWithoutFeedback || []),
    ...(allInterviews || []),
  ];

  const availableCount = availableInterviews?.length || 0;
  const takenCount = takenInterviews?.length || 0;

  return (
    <>
      <BackgroundAnimation />
      <section className="card-cta">
        <div className="flex flex-col gap-4 max-w-lg">
          <h2 className="text-2xl font-semibold">Get Interview-Ready</h2>
          <p className="text-sm text-gray-500">
            Practice real interview questions generated for your role and get
            instant AI feedback.
          </p>

          <div className="flex gap-3">
            <Button asChild className="btn-primary max-sm:w-full">
              <Link href="/interview">Start an Interview</Link>
            </Button>
            <Button asChild className="btn-ghost hidden md:inline-flex">
              <Link href="#available">Browse Interviews</Link>
            </Button>
          </div>

          <div className="flex gap-4 text-sm text-gray-500 mt-3">
            <div>
              <div className="font-semibold">{availableCount}</div>
              <div>Available</div>
            </div>
            <div>
              <div className="font-semibold">{takenCount}</div>
              <div>Taken</div>
            </div>
          </div>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section id="available" className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="flex items-baseline gap-3">
            Available Interviews
            <span className="text-sm text-gray-400">({availableCount})</span>
          </h2>
          {availableCount === 0 && (
            <Button asChild className="btn-ghost">
              <Link href="/interview">Create an Interview</Link>
            </Button>
          )}
        </div>

        {availableInterviews && availableInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableInterviews
              .filter((interview): interview is Interview => Boolean(interview))
              .map((interview) => (
                <InterviewCard
                  key={interview?.id}
                  userId={user?.id}
                  interviewId={interview?.id}
                  role={interview?.role}
                  type={interview?.type}
                  techstack={interview?.techstack}
                  createdAt={interview?.createdAt}
                  company={interview?.company}
                />
              ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <h3 className="font-semibold">No interviews available</h3>
            <p className="text-sm text-gray-500 mt-2">
              Create your first mock interview tailored to your target role.
            </p>
            <div className="mt-4">
              <Button asChild className="btn-primary">
                <Link href="/interview">Create Interview</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="flex items-baseline gap-3">
            Taken Interviews
            <span className="text-sm text-gray-400">({takenCount})</span>
          </h2>
        </div>

        {takenInterviews && takenInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {takenInterviews
              .filter((interview): interview is Interview => Boolean(interview))
              .map((interview) => (
                <InterviewCard
                  key={interview?.id}
                  userId={user?.id}
                  interviewId={interview?.id}
                  role={interview?.role}
                  type={interview?.type}
                  techstack={interview?.techstack}
                  createdAt={interview?.createdAt}
                  company={interview?.company}
                />
              ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <h3 className="font-semibold">
              You haven&apos;t taken any interviews yet
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Start a new mock interview to get personalized feedback.
            </p>
            <div className="mt-4">
              <Button asChild className="btn-primary">
                <Link href="/interview">Start Interview</Link>
              </Button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
