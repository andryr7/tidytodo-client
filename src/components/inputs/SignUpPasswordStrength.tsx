import { SignUpFormValues } from '@customTypes/formValues';
import { Box, Progress, PasswordInput, Group, Text, Center } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text color={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size="0.9rem" stroke={1.5} /> : <IconX size="0.9rem" stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[@$!%*?&]/, label: 'Includes special symbol (@$!%*?&)' }
];

function getStrength(password: string) {
  let multiplier = password.length > 7 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });
  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export function SignUpPasswordStrength({ form }: { form: UseFormReturnType<SignUpFormValues> }) {
  const formProps = form.getInputProps('password');
  const strength = getStrength(formProps.value);
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(formProps.value)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ bar: { transitionDuration: '0ms' } }}
        value={
          formProps.value.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
        key={index}
        size={4}
      />
    ));

  return (
    <div>
      <PasswordInput placeholder="Your password" label="Password" required {...formProps} />

      <Group spacing={5} grow mt="xs" mb="md">
        {bars}
      </Group>

      <PasswordRequirement label="Has at least 8 characters" meets={formProps.value.length > 7} />
      {checks}
    </div>
  );
}
