// FILE: components/reports/ReportButton.tsx
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ReportButtonProps {
  targetType: string;
  targetId: string;
  className?: string;
}

export default function ReportButton({ targetType, targetId, className = "" }: ReportButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    "Hate speech or discrimination",
    "Harassment or bullying",
    "Spam or promotional content",
    "Violence or threats",
    "Nudity or sexual content",
    "Copyright infringement",
    "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason) {
      toast.error("Please select a reason for reporting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          targetType,
          targetId,
          reason,
          details
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Report submitted successfully");
        setIsOpen(false);
        setReason("");
        setDetails("");
      } else {
        toast.error(result.error || "Failed to submit report");
      }
    } catch (error) {
      console.error("Report error:", error);
      toast.error("Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`text-sm text-red-600 hover:text-red-800 ${className}`}
      >
        Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Report Content</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason for reporting
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a reason</option>
                  {reportReasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide any additional context..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}