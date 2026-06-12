"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { CharacterSelect } from "./CharacterSelect";
import { AvatarCustomizer } from "./AvatarCustomizer";
import type { CharacterType, Board } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Gamepad2,
  GraduationCap,
  BookOpen,
  Palette,
  User,
  School,
  Swords,
  Wand2,
  Ghost,
  Crosshair,
  FlaskConical,
  Compass,
} from "lucide-react";

const boards: { value: Board; label: string; description: string }[] = [
  { value: "CBSE", label: "CBSE", description: "Central Board of Secondary Education" },
  { value: "ICSE", label: "ICSE", description: "Indian Certificate of Secondary Education" },
  { value: "StateBoard", label: "State Board", description: "State-specific curriculum" },
  { value: "IGCSE", label: "IGCSE", description: "International General Certificate" },
  { value: "GCSE", label: "GCSE", description: "General Certificate of Secondary Education" },
  { value: "USCurriculum", label: "US Curriculum", description: "American education system" },
];

const classOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

interface StepConfig {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const steps: StepConfig[] = [
  {
    id: "welcome",
    title: "Begin Your Quest",
    subtitle: "Embark on a learning adventure like no other",
    icon: <Sparkles className="size-5" />,
  },
  {
    id: "info",
    title: "Who Are You?",
    subtitle: "Tell us about yourself, adventurer",
    icon: <User className="size-5" />,
  },
  {
    id: "class",
    title: "Your Grade",
    subtitle: "Select your current class",
    icon: <GraduationCap className="size-5" />,
  },
  {
    id: "board",
    title: "Your Curriculum",
    subtitle: "Choose your educational board",
    icon: <BookOpen className="size-5" />,
  },
  {
    id: "character",
    title: "Choose Your Hero",
    subtitle: "Pick a character that represents you",
    icon: <Gamepad2 className="size-5" />,
  },
  {
    id: "avatar",
    title: "Customize Avatar",
    subtitle: "Make your hero unique",
    icon: <Palette className="size-5" />,
  },
  {
    id: "summary",
    title: "Ready for Adventure",
    subtitle: "Review your profile and begin",
    icon: <School className="size-5" />,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export function OnboardingWizard() {
  const router = useRouter();
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [studentClass, setStudentClass] = useState("");
  const [board, setBoard] = useState<Board | "">("");
  const [characterType, setCharacterType] = useState<CharacterType>("explorer");
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6");
  const [secondaryColor, setSecondaryColor] = useState("#6d28d9");

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0: return true;
      case 1: return name.trim().length > 0 && age !== "";
      case 2: return studentClass !== "";
      case 3: return board !== "";
      case 4: return true;
      case 5: return true;
      case 6: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to complete onboarding");
        router.push("/login");
        return;
      }

      const { error: updateError } = await (supabase as any)
        .from("profiles")
        .update({
          display_name: name.trim(),
          age: age === "" ? null : Number(age),
          class: studentClass,
          board: board || null,
          character_type: characterType,
          avatar_url: JSON.stringify({
            primaryColor,
            secondaryColor,
          }),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        toast.error("Failed to save profile");
        console.error(updateError);
        return;
      }

      toast.success("Profile complete! Your adventure begins now!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6 py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="size-28 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
                <Sparkles className="size-12 text-white" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome to QuestLearn AI!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Learning is an epic adventure. Master subjects, defeat bosses,
                collect rewards, and level up your knowledge. Ready to begin?
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {["Learn", "Battle", "Conquer"].map((word) => (
                <div
                  key={word}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm font-medium text-primary"
                >
                  {word}
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Your Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) =>
                  setAge(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="Enter your age"
                min={1}
                max={99}
                className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="py-4">
            <div className="grid grid-cols-4 gap-3">
              {classOptions.map((cls) => (
                <motion.button
                  key={cls}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStudentClass(cls)}
                  className={cn(
                    "py-4 rounded-xl border-2 text-lg font-bold transition-all duration-200",
                    studentClass === cls
                      ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20"
                      : "border-slate-700/50 bg-slate-800/40 text-muted-foreground hover:border-slate-500/50 hover:text-foreground"
                  )}
                >
                  {cls}
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="py-4 space-y-3">
            {boards.map((b) => (
              <motion.button
                key={b.value}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBoard(b.value)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  board === b.value
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                    : "border-slate-700/50 bg-slate-800/40 hover:border-slate-500/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-10 rounded-lg flex items-center justify-center text-sm font-bold",
                      board === b.value
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-muted-foreground"
                    )}
                  >
                    {b.label.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3
                      className={cn(
                        "font-semibold",
                        board === b.value ? "text-primary" : "text-foreground"
                      )}
                    >
                      {b.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {b.description}
                    </p>
                  </div>
                  {board === b.value && (
                    <Check className="size-5 text-primary ml-auto" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 4:
        return <CharacterSelect value={characterType} onChange={setCharacterType} />;

      case 5:
        return (
          <AvatarCustomizer
            characterType={characterType}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onPrimaryChange={setPrimaryColor}
            onSecondaryChange={setSecondaryColor}
          />
        );

      case 6:
        return (
          <div className="py-4 space-y-5">
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div
                  className="size-24 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <span className="text-4xl text-white">
                    {characterType === "knight" && <Swords />}
                    {characterType === "wizard" && <Wand2 />}
                    {characterType === "ninja" && <Ghost />}
                    {characterType === "archer" && <Crosshair />}
                    {characterType === "scientist" && <FlaskConical />}
                    {characterType === "explorer" && <Compass />}
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 space-y-3">
              <SummaryRow label="Name" value={name} />
              <SummaryRow label="Age" value={age.toString()} />
              <SummaryRow label="Class" value={`Class ${studentClass}`} />
              <SummaryRow label="Board" value={board} />
              <SummaryRow
                label="Character"
                value={characterType.charAt(0).toUpperCase() + characterType.slice(1)}
              />
              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                <span className="text-sm text-muted-foreground min-w-[100px]">
                  Avatar Colors
                </span>
                <div
                  className="size-6 rounded-full border-2 border-slate-600"
                  style={{ backgroundColor: primaryColor }}
                />
                <div
                  className="size-6 rounded-full border-2 border-slate-600"
                  style={{ backgroundColor: secondaryColor }}
                />
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-sm text-primary font-medium">
                Your adventure awaits! Review your profile and confirm to begin.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs text-muted-foreground">
            {steps[currentStep].title}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 100 }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full relative"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center transition-all duration-300",
                index <= currentStep ? "opacity-100" : "opacity-30"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-full flex items-center justify-center text-xs transition-all duration-300",
                  index < currentStep
                    ? "bg-primary text-white"
                    : index === currentStep
                      ? "bg-primary/20 text-primary border border-primary"
                      : "bg-slate-800 text-muted-foreground border border-slate-700"
                )}
              >
                {index < currentStep ? (
                  <Check className="size-4" />
                ) : (
                  index + 1
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
          {steps[currentStep].icon}
          <h2 className="text-xl font-bold text-foreground">
            {steps[currentStep].title}
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep].subtitle}
        </p>
      </div>

      <div className="min-h-[300px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
        <Button
          variant="ghost"
          size="lg"
          onClick={goBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="size-5 mr-1" />
          Back
        </Button>

        {currentStep < steps.length - 1 ? (
          <Button
            variant="game-primary"
            size="lg"
            onClick={goNext}
            disabled={!canProceed()}
          >
            Next
            <ChevronRight className="size-5 ml-1" />
          </Button>
        ) : (
          <Button
            variant="game-primary"
            size="lg"
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles className="size-5 mr-1" />
                Begin Adventure!
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
