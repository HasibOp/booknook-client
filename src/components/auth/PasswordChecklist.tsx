import { HiCheckCircle, HiOutlineMinusCircle } from "react-icons/hi";
import { passwordRules } from "@/lib/validators";

export default function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="grid gap-1.5 text-sm sm:grid-cols-2" aria-live="polite">
      {passwordRules.map((rule) => {
        const passed = rule.test(value);
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 ${passed ? "text-success" : "text-base-content/60"}`}
          >
            {passed ? (
              <HiCheckCircle className="size-4 shrink-0" />
            ) : (
              <HiOutlineMinusCircle className="size-4 shrink-0" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}
