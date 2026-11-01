import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

type SectionProps = {
	title: string;
	addLabel?: string;
	onAdd?: () => void;
	children: ReactNode;
};

export function Section({ title, addLabel, onAdd, children }: SectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{children}
				{onAdd && <AddButton label={addLabel ?? "Add"} onClick={onAdd} />}
			</CardContent>
		</Card>
	);
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
	return (
		<Button type="button" variant="outline" size="sm" className="self-start" onClick={onClick}>
			<PlusIcon />
			{label}
		</Button>
	);
}

type ItemControlsProps = {
	label: string;
	index: number;
	count: number;
	onMove: (from: number, to: number) => void;
	onRemove: (index: number) => void;
};

export function ItemControls({ label, index, count, onMove, onRemove }: ItemControlsProps) {
	return (
		<div className="flex gap-1">
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={`Move ${label} up`}
				disabled={index === 0}
				onClick={() => onMove(index, index - 1)}
			>
				<ArrowUpIcon />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={`Move ${label} down`}
				disabled={index === count - 1}
				onClick={() => onMove(index, index + 1)}
			>
				<ArrowDownIcon />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={`Remove ${label}`}
				onClick={() => onRemove(index)}
			>
				<TrashIcon />
			</Button>
		</div>
	);
}
