export const ACTION_PROMPT =
  "Find the most appropriate action to perform from the message below. Take into account meaning of the words and final result of every action. As a result return action id and nothing more. If you don't match any action return 'null'. Below is the list of available and recognizable actions. \n ###actions \n  {{actions}} \n ###message\n {{message}}";
