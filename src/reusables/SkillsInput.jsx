import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { suggestSkill } from "@/utils/skillSuggestionHelper";
import { Label } from "@/components/ui/label";

const SkillsInput = ({ control, error }) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  return (
    <div className="space-y-2">
      <Label className="font-medium">
        Skills <span className="text-red-700">*</span>
      </Label>

      <Controller
        name="skills"
        control={control}
        defaultValue={[]}
        render={({ field: { value: skills = [], onChange } }) => {
          const addSkill = (skill) => {
            const trimmed = skill.trim();
            if (trimmed && !skills.includes(trimmed) && skills.length < 10) {
              onChange([...skills, trimmed]);
              setInputValue("");
            }
          };

          const removeSkill = (skillToRemove) => {
            onChange(skills.filter((skill) => skill !== skillToRemove));
          };

          const handleSuggestionClick = (skill) => {
            addSkill(skill);
          };

          const availableSuggestions = suggestSkill(inputValue).filter(
            (skill) => !skills.includes(skill)
          );

          return (
            <div className="space-y-4">
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className=""
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-700 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    skills.length >= 10
                      ? "Maximum skills reached"
                      : "Type a skill eg. React"
                  }
                  disabled={skills.length >= 10}
                  className=""
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(inputValue);
                    }
                  }}
                />
              </div>

              <div className="flex justify-between text-xs">
                <span>Skills added: {skills.length} / 10</span>
                <span>
                  {skills.length < 5
                    ? `${5 - skills.length} more required`
                    : ""}
                </span>
              </div>

              {showSuggestions &&
                availableSuggestions.length > 0 &&
                skills.length < 10 && (
                  <div className="space-y-2">
                    <p className="text-sm">Suggested skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSuggestions.map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(skill)}
                          className="text-xs transition-colors"
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

              {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
          );
        }}
      />
    </div>
  );
};

export default SkillsInput;
