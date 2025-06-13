import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { FeedThunk } from "@/features/feed/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Feed() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.feed.users);
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const feedFetch = async () => {
      try {
        const response = await dispatch(FeedThunk()).unwrap();
        console.log(response.message || "Feed fetched");
      } catch (err) {
        toast.error("Failed to fetch Feed");
      }
    };
    feedFetch();
  }, [dispatch]);
 useEffect(() => {
  setProfiles(users);
}, [users]);

  const handleSwipe = async (direction) => {
    const currentUser = profiles[index];
    if (!currentUser) return;

    try {
      console.log("Yes");
      setIndex((prev) => prev + 1);
    } catch (err) {
      console.error("Swipe error:", err);
    }
  };

  const current = profiles[index];
  console.log("current is ",current);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      {current ? (
        <Card className="w-full max-w-md shadow-xl rounded-2xl p-4">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <img
              src={current?.photoUrl}
              alt={`${current.firstName} ${current.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />

            <div>
              <h2 className="text-xl font-semibold">
                {current.firstName} {current.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {current.experience} yrs experience
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {current.skills?.map((skill) => (
                <span
                  key={skill}
                  className="text-sm px-2 py-1 bg-muted rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex gap-6 mt-4">
              <Button
                variant="outline"
                className="rounded-full w-12 h-12"
                onClick={() => handleSwipe("left")}
              >
                <X className="text-red-500" />
              </Button>
              <Button
                variant="outline"
                className="rounded-full w-12 h-12"
                onClick={() => handleSwipe("right")}
              >
                <Check className="text-green-600 " />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <h2 className="text-lg font-medium text-center">
          No more profiles to show!
        </h2>
      )}
    </div>
  );
}
