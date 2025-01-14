import { CheckCircleIcon } from "lucide-react";

export function FeaturesList() {
  const features = [
    {
      title: "Real-Time Editing",
      description:
        "Instantly see changes as you type with our live preview feature.",
    },
    {
      title: "WebContainers Technology",
      description:
        "Experience fast and isolated development environments right in your browser.",
    },
    {
      title: "Easy Deployment",
      description:
        "Deploy your website with a single click to share it with the world.",
    },
    {
      title: "Collaborative Tools",
      description:
        "Work with your team in real-time, with built-in collaboration features.",
    },
    {
      title: "Intuitive Interface",
      description:
        "A clean, user-friendly interface designed to make web development a breeze.",
    },
  ];

  return (
    <ul className="space-y-4">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start space-x-4">
          <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-semibold text-primary">
              {feature.title}
            </h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
